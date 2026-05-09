from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from base.models import *
from .models import  *

# main models

class ProfileSerializer(serializers.ModelSerializer):
    user_id  = serializers.PrimaryKeyRelatedField(source="user", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "user_id", "username", "name", "contact_no", "bio","pincode", "city", "country", "points","level"]

from rest_framework import serializers
from .models import Book, Review

class BookSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    ratings_count = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'bookid', 'title', 'authors', 'publisher',
            'published_date', 'description', 'main_category', 'categories', 'page_count',
            'language', 'maturity_rating', 'google_average_rating', 'google_ratings_count', 'google_popularity'
        ]

    def get_average_rating(self, obj):
        reviews = Review.objects.filter(bookid=obj.bookid)
        if not reviews.exists():
            return None
        return round(sum([review.rating for review in reviews]) / reviews.count(), 2)

    def get_ratings_count(self, obj):
        return Review.objects.filter(bookid=obj.bookid).count()


class PostSerializer(serializers.ModelSerializer):
    # user = ProfileSerializer(read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'user', 'message','user_name','created_at']  #from models


# remaining models

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book', 'user', 'created_at', 'rating', 'message']
        read_only_fields = ['user']

class CommentSerializer(serializers.ModelSerializer):
    pass

class FanartSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    # books = BookSerializer(many=True)
    
    class Meta:
        model = Fanart
        fields = ['id', 'title', 'user_name', 'image']

class FriendshipSerializer(serializers.ModelSerializer):
    user1_id = serializers.PrimaryKeyRelatedField(source="user1",   read_only=True)
    user2_id = serializers.PrimaryKeyRelatedField(source="user2",   read_only=True)
    user1_username = serializers.CharField(source="user1.username", read_only=True)
    user2_username = serializers.CharField(source="user2.username", read_only=True)

    class Meta:
        model = Friendship
        fields = ["user1_id", "user1_username", "user2_id", "user2_username"]

class BookListSerializer(serializers.ModelSerializer):
    # books = BookSerializer(many=True)  # Nested serialization to show book details

    class Meta:
        model = BookList
        fields = ['book_list_id', 'name', 'user', 'books']

    def create(self, validated_data):
        books_data = validated_data.pop('books', [])
        booklist = BookList.objects.create(**validated_data)
        booklist.books.set(books_data)  # ManyToMany relationship
        return booklist

    def update(self, instance, validated_data):
        books_data = validated_data.pop('books', [])
        instance.name = validated_data.get('name', instance.name)
        instance.books.set(books_data)  # Update book list
        instance.save()
        return instance

class RentSerializer(serializers.ModelSerializer):
    owner_average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Rent
        fields = ['user','rent_id', 'title', 'price_per_day', 'deposit', 'condition', 'status', 'image', 'owner_average_rating']

    def get_owner_average_rating(self, obj):
        return obj.user.profile.get_average_rent_rating()

class UserReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.username', read_only=True)

    class Meta:
        model = UserReview
        fields = ['id','reviewee', 'reviewer', 'reviewer_name', 'rating', 'review_text', 'created_at', 'rent', 'sell']

class WantToSellSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.title')
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = WantToSell
        fields = '__all__'


class DefaultBookListEntrySerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()

    class Meta:
        model = DefaultBookList
        fields = ['id', 'user', 'book', 'type', 'pages_read', 'start_time', 'last_updated', 'completion_time', 'progress_percentage']
        read_only_fields = ['user', 'start_time', 'last_updated', 'completion_time', 'progress_percentage']
import calendar
from django.db.models import Sum
from itertools import chain
from django.db.models import Q, Value,Avg
import requests, math, random, json
from rest_framework.response import Response
from django.db.models.functions import Replace, Lower
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
from rest_framework import status
from collections import Counter

from .models import *
from .serializers import *
from .utils import haversine


# main models

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile_details(request):
    profile_obj = get_object_or_404(Profile, user=request.user)
    serializer  = ProfileSerializer(profile_obj)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile_details(request):
    profile_obj = get_object_or_404(Profile, user=request.user)
    serializer  = ProfileSerializer(profile_obj, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Profile updated successfully",
            "data": serializer.data
        }, status=200)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_user_location(request):
    lat = request.data.get('latitude')
    lon = request.data.get('longitude')

    if lat is not None and lon is not None:
        profile = request.user.profile
        profile.latitude = lat
        profile.longitude = lon
        profile.save()
        return Response({'message': 'Location saved successfully'}, status=status.HTTP_200_OK)

    return Response({'error': 'Latitude and longitude are required'}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_books(request):
#     books = Book.objects.all()
#     serializer = BookSerializer(books, many=True)
#     return Response(serializer.data)

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_book_details(request, isbn):
#     book = get_object_or_404(Book, isbn=isbn)
#     serializer = BookSerializer(book)
#     return Response(serializer.data)


# remaining models

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_friends(request):
    # Get friendships where the user initiated the request
    friendship_objs1 = Friendship.objects.filter(user1=request.user)  # ✅ FIXED
    friendship_objs2 = Friendship.objects.filter(user2=request.user)

    # Combine both querysets
    all_objs = friendship_objs1 | friendship_objs2

    # Get usernames of friends
    friends_usernames = set()
    for friendship in all_objs:
        if friendship.user1 == request.user:
            friends_usernames.add(friendship.user2.username)
        else:
            friends_usernames.add(friendship.user1.username)

    return Response({"friends": list(friends_usernames)}, status=200)

@api_view(['GET'])
def get_user_reviews(request, user_id):
    user = get_object_or_404(User, id=user_id)
    reviews = UserReview.objects.filter(reviewee=user).order_by('-created_at')
    serializer = UserReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def booklist_list(request):
    if request.method == 'GET':
        booklists = BookList.objects.filter(user=request.user)
        serializer = BookListSerializer(booklists, many=True)
        final_response = serializer.data
        for data in final_response: data.pop("books") # removing books from final_response
        return Response(final_response)

    elif request.method == 'POST':
        serializer = BookListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Assign user automatically
            return Response({"message":"Booklist created successfully",
                            "data":serializer.data},
                              status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def booklist_detail(request, pk):
    booklist = get_object_or_404(BookList, pk=pk)

    if request.method == 'GET':
        serializer = BookListSerializer(booklist)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if booklist.user != request.user:
            return Response({"detail": "You don't have permission to edit this booklist."}, 
                            status=status.HTTP_403_FORBIDDEN)

        serializer = BookListSerializer(booklist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Booklist successfully edited.", 
                             "data": serializer.data}, 
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if booklist.user != request.user:
            return Response({"detail": "You don't have permission to delete this booklist."}, 
                            status=status.HTTP_403_FORBIDDEN)

        booklist.delete()
        return Response({"message": "Booklist successfully deleted."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def rent_list(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        user_lat = request.GET.get('latitude')
        user_lng = request.GET.get('longitude')
        if user_id:
            rents = Rent.objects.filter(user__id=user_id)
            serializer = RentSerializer(rents, many=True)
            return Response(serializer.data)
        else:
            if request.user.is_authenticated:
                # exclude your own rents from the list
                rents = Rent.objects.exclude(user=request.user)
            else:
                # show all rents if anonymous
                rents = Rent.objects.all()

        friends = User.objects.filter(Q(friendship_initiated__user2=request.user) | Q(friendship_received__user1=request.user))

        friends_rents = rents.filter(user__in=friends)
        others_rents = rents.exclude(user__in=friends)

        search_query = request.GET.get('search_query')
        if not search_query:
            # user_profile = request.user.profile
            # friends_rents=friends_rents.filter(
            #     user__profile__city=user_profile.city,
            #     # user__profile__pincode=user_profile.pincode,
            #     user__profile__country=user_profile.country)
            # others_rents=others_rents.filter(                                        // doubts:incomplete:not finalised
            #     user__profile__city=user_profile.city,
            #     # user__profile__pincode=user_profile.pincode,
            #     user__profile__country=user_profile.country)
            # friends_rents=friends_rents.order_by('status').order_by('-rating')
            friends_rents = friends_rents.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by('status', '-user_avg_rating')
            # others_rents=others_rents.order_by('status').order_by('-rating')
            others_rents = others_rents.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by('status', '-user_avg_rating')

        if search_query:
            friends_rents = friends_rents.filter(title__icontains=search_query)
            others_rents = others_rents.filter(title__icontains=search_query)

        price_limit = request.GET.get('price_limit')  # Example: "<100"
        deposit_limit = request.GET.get('deposit_limit')  # Example: "<100"
        has_deposit = request.GET.get('has_deposit')  # "true" or "false"
        has_image = request.GET.get('has_image')
        availability=request.GET.get('available')

        if price_limit:
            # min_price, max_price = map(int, price_range.split('-'))
            friends_rents = friends_rents.filter( price_per_day__lte=price_limit)
            others_rents = others_rents.filter( price_per_day__lte=price_limit)

        if deposit_limit:
            # min_deposit, max_deposit = map(int, deposit_range.split('-'))
            friends_rents = friends_rents.filter(deposit__lte=deposit_limit)
            others_rents = others_rents.filter( deposit__lte=deposit_limit)

        if has_deposit == "true":
            friends_rents = friends_rents.filter(deposit__gt=0)  
            others_rents = others_rents.filter(deposit__gt=0)  
        elif has_deposit == "false":
            friends_rents = friends_rents.filter(deposit=0)  
            others_rents = others_rents.filter(deposit=0)  

        if has_image == "true":
            friends_rents = friends_rents.exclude(image__isnull=True).exclude(image='')
            others_rents = others_rents.exclude(image__isnull=True).exclude(image='')

        if availability=="true":
            friends_rents=friends_rents.filter(status='Available')
            others_rents=others_rents.filter(status='Available')

        sort_by = request.GET.get('ordering')

        if sort_by == "price_low_to_high":
            friends_rents = friends_rents.order_by('price_per_day')   
            others_rents = others_rents.order_by('price_per_day')   
        elif sort_by == "deposit_low_to_high":
            friends_rents = friends_rents.order_by('deposit')    
            others_rents = others_rents.order_by('deposit')    
        elif sort_by == "rating_high_to_low":
            friends_rents = friends_rents.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by( '-user_avg_rating')  
            others_rents = others_rents.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by( '-user_avg_rating')
        elif sort_by == "nearest" and user_lat and user_lng:
            try:
                user_lat = float(user_lat)
                user_lng = float(user_lng)

                def sort_by_distance(rent):
                    if rent.lat is not None and rent.lng is not None:
                        return haversine(user_lat, user_lng, rent.lat, rent.lng)
                    else:
                        return float('inf')  # push to end if location not set

                friends_rents.sort(key=sort_by_distance)
                others_rents.sort(key=sort_by_distance)
            except ValueError:
                pass  # if conversion fails, skip proximity sort
            
            
    

        rents=list(chain(friends_rents,others_rents))

        serializer = RentSerializer(rents, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Rent post successfully created", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def rent_detail(request, pk):
    rent = get_object_or_404(Rent, pk=pk)

    if request.method == 'GET':
        serializer = RentSerializer(rent)
        reviews = UserReview.objects.filter(rent=rent).exclude(review_text__isnull=True).exclude(review_text='')

        friends = User.objects.filter(Q(friendship_initiated__user2=request.user) | Q(friendship_received__user1=request.user))

        friends_reviews = reviews.filter(reviewer__in=friends)
        others_reviews = reviews.exclude(reviewer__in=friends)

        sort_by = request.GET.get('ordering')
         
        if sort_by == "rating":
            friends_reviews = friends_reviews.order_by('-rating')
            others_reviews = others_reviews.order_by('-rating')
        else:
            friends_reviews = friends_reviews.order_by('-created_at')  
            others_reviews = others_reviews.order_by('-created_at') #make newest default

        reviews = list(friends_reviews) + list(others_reviews)
        RentReview_serializer = UserReviewSerializer(reviews, many=True)

        owner = rent.user.profile

        owner_info = {
            "username": owner.name,
            "contact": str(owner.contact_no) ,
            #"profile_picture": owner.profile_picture.url if owner.profile_picture else None,
            "average_rating": owner.get_average_rent_rating() ,
        }
        return Response({"rent_data":serializer.data,
                         "review_data":RentReview_serializer.data,
                         "owner_data":owner_info})

    elif request.method == 'PUT':
        if rent.user != request.user:
            return Response({"detail": "You don't have permission to edit this rent post."}, 
                            status=status.HTTP_403_FORBIDDEN)

        serializer = RentSerializer(rent, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Rent post successfully edited.",
                              "data": serializer.data}, 
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if rent.user != request.user:
            return Response({"detail": "You don't have permission to delete this rent post."}, 
                            status=status.HTTP_403_FORBIDDEN)
        rent.delete()
        return Response({"message": "Rent post successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user_review(request):
    review_type = request.data.get("type")  # "rent" or "sell"
    item_id = request.data.get("id")        # rent_id or sell_id
    rating = request.data.get("rating")
    text = request.data.get("text", "").strip()

    if review_type not in ["rent", "sell"]:
        return Response({"detail": "Invalid type. Must be 'rent' or 'sell'."},
                        status=status.HTTP_400_BAD_REQUEST)

    if review_type == "rent":
        item = get_object_or_404(Rent, rent_id=item_id)
    else:
        item = get_object_or_404(WantToSell, sell_id=item_id)

    if item.user == request.user:
        return Response({"detail": "You cannot review yourself."}, status=status.HTTP_400_BAD_REQUEST)

    # Build data based on type
    data = {
        "reviewer": request.user.id,
        "reviewee": item.user.id,
        "rating": rating,
        "review_text": text
    }
    if review_type == "rent":
        data["rent"] = item.rent_id
    else:
        data["sell"] = item.sell_id

    serializer = UserReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save()

        word_count = len(text.split())
        profile = request.user.profile

        if rating and word_count >= 15:
            profile.points += 15
        elif rating and word_count < 15 and word_count > 0:
            profile.points += 10
        elif rating and word_count == 0:
            profile.points += 5
        elif word_count >= 15:
            profile.points += 10
        elif word_count > 0:
            profile.points += 5
        
        profile.save()

        return Response({"message": "Review added successfully.", "data": serializer.data},
                        status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.H2TTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def want_to_sell_list(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        if user_id:
            sales = WantToSell.objects.filter(user__id=user_id)
            serializer = WantToSellSerializer(sales, many=True)
            return Response(serializer.data)

        else:
            if request.user.is_authenticated:
                sales=WantToSell.objects.exclude(user=request.user)
            else:
                sales = WantToSell.objects.all()

        friends = User.objects.filter(Q(friendship_initiated__user2=request.user) | Q(friendship_received__user1=request.user))

        friends_sales = sales.filter(user__in=friends)
        others_sales = sales.exclude(user__in=friends)

        search_query = request.GET.get('search_query')
        if not search_query:
            # user_profile = request.user.profile
            # friends_sales=friends_sales.filter(
            #     user__profile__city=user_profile.city,
            #     user__profile__pincode=user_profile.pincode,
            #     user__profile__country=user_profile.country)
            # others_sales=others_sales.filter(
            #     user__profile__city=user_profile.city,
            #     user__profile__pincode=user_profile.pincode,
            #     user__profile__country=user_profile.country)
            friends_sales = friends_sales.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by( '-user_avg_rating',)
            others_sales = others_sales.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by( '-user_avg_rating')

        if search_query:
            friends_sales = friends_sales.filter(title__icontains=search_query)
            others_sales = others_sales.filter(title__icontains=search_query)


        price_limit = request.GET.get('price_limit')
        has_image = request.GET.get('has_image')

        if price_limit:
            # min_price, max_price = map(int, price_range.split('-'))
            friends_sales = friends_sales.filter( price__lte=price_limit)
            others_sales = others_sales.filter( price__lte=price_limit)
        if has_image == "true":
            friends_sales = friends_sales.exclude(image__isnull=True).exclude(image='')
            others_sales = others_sales.exclude(image__isnull=True).exclude(image='')

        sort_by = request.GET.get('ordering')

        if sort_by == "price_low_to_high":
            friends_sales = friends_sales.order_by('price')  
            others_sales = others_sales.order_by('price') 
        if sort_by=="rating":
            friends_sales = friends_sales.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by( '-user_avg_rating')  
            others_sales = others_sales.annotate(user_avg_rating=Avg('user__received_user_reviews__rating')).order_by( '-user_avg_rating') 
#add sort by rating
        sales=list(chain(friends_sales,others_sales))   
        serializer = WantToSellSerializer(sales, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WantToSellSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message":"sale post successfully created",
                             "data":serializer.data},
                             status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def want_to_sell_detail(request, pk):
    selling = get_object_or_404(WantToSell, pk=pk)

    if request.method == 'GET':
        serializer = WantToSellSerializer(selling)#add reviews part
        reviews = UserReview.objects.filter(sell=selling).exclude(review_text__isnull=True).exclude(review_text='')

        friends = User.objects.filter(Q(friendship_initiated__user2=request.user) | Q(friendship_received__user1=request.user))

        friends_reviews = reviews.filter(reviewer__in=friends)
        others_reviews = reviews.exclude(reviewer__in=friends)

        sort_by = request.GET.get('ordering')
         
        if sort_by == "rating":
            friends_reviews = friends_reviews.order_by('-rating')
            others_reviews = others_reviews.order_by('-rating')
        else:
            friends_reviews = friends_reviews.order_by('-created_at')  
            others_reviews = others_reviews.order_by('-created_at') #make newest default

        reviews = list(chain(friends_reviews, others_reviews))
        SaleReview_serializer = UserReviewSerializer(reviews, many=True)

        owner = selling.user.profile

        owner_info = {
            "username": owner.name,
            "contact": str(owner.contact_no) ,
            #"profile_picture": owner.profile_picture.url if owner.profile_picture else None,
            "average_rating": owner.get_average_rent_rating() ,
        }
        return Response({"sale_data":serializer.data,
                         "review_data":SaleReview_serializer.data,
                         "owner_data":owner_info})

    elif request.method == 'PUT':
        if selling.user != request.user:
            return Response({"detail": "You don't have permission to edit this selling post."}, 
                            status=status.HTTP_403_FORBIDDEN)

        serializer = WantToSellSerializer(selling, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Selling post successfully edited.",
                              "data": serializer.data}, 
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if selling.user != request.user:
            return Response({"detail": "You don't have permission to delete this selling post."}, 
                            status=status.HTTP_403_FORBIDDEN)

        selling.delete()
        return Response({"message": "Selling post successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def combined_search(request):
    user = request.user
    user_pincode = user.profile.pincode

    friends = User.objects.filter(
        Q(friendship_initiated__user2=user) |
        Q(friendship_received__user1=user)
    ).distinct()

    rents = Rent.objects.filter(
        user__in=friends,
        user__profile__pincode=user_pincode,
        status='Available'
    )
    rent_data = RentSerializer(rents, many=True).data
    for item in rent_data:
        item['type'] = 'rent'

    sells = WantToSell.objects.filter(
        user__in=friends,
        user__profile__pincode=user_pincode
    )
    sell_data = WantToSellSerializer(sells, many=True).data
    for item in sell_data:
        item['type'] = 'sell'

    combined = rent_data + sell_data

    return Response({"results": combined})

#post view
@api_view(['GET', 'POST']) #get- to get list of all posts, post: to post a new one
@permission_classes([IsAuthenticated])
def post_list(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        if user_id:
            posts = Post.objects.filter(user__id=user_id).order_by('-created_at')
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)
        else:
            posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message":"post successfully created","data":serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view([ 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)

    # if request.method == 'GET':
    #     serializer = PostSerializer(post)
    #     return Response(serializer.data)

    if request.method == 'PUT':
        if post.user != request.user:
            return Response({"detail": "You don't have permission to edit this post"}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"post successfully edited","data":serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if post.user != request.user:
            return Response({"detail": "You don't have permission to delete this post"}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        post.delete()
        return Response({"message":"post successfully deleted"},status=status.HTTP_204_NO_CONTENT)
    
#review views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    serializer = ReviewSerializer(data=request.data)

    text=request.data.get("text", "").strip()
    rating=request.data.get("rating")

    if serializer.is_valid():
        serializer.save(user=request.user)  # attaches the logged-in user
        word_count = len(text.split())
        profile = request.user.profile

        if rating and word_count >= 15:
            profile.points += 15
        elif rating and word_count < 15 and word_count > 0:
            profile.points += 10
        elif rating and word_count == 0:
            profile.points += 5
        elif word_count >= 15:
            profile.points += 10
        elif word_count > 0:
            profile.points += 5
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def review_detail(request, pk):
    review = get_object_or_404(Review, pk=pk)

    if request.method == 'GET':
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if review.user != request.user:
            return Response({"detail": "You can't edit this review."}, status=status.HTTP_403_FORBIDDEN)
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if review.user != request.user:
            return Response({"detail": "You can't delete this review."}, status=status.HTTP_403_FORBIDDEN)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#fanart views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def fanart_list(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        if user_id:
            fanarts = Fanart.objects.filter(user__id=user_id).order_by('created_at')
            serializer = FanartSerializer(fanarts, many=True)
            return Response(serializer.data)
        else:
            search_query = request.GET.get('search_query')
            if search_query:
                fanarts = Fanart.objects.filter(title__icontains=search_query).order_by('-created_at')
            else:
                fanarts = Fanart.objects.all().order_by('-created_at')
        serializer = FanartSerializer(fanarts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FanartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def fanart_detail(request, pk):
    fanart = get_object_or_404(Fanart, pk=pk)

    # if request.method == 'GET':
    #     serializer = FanartSerializer(fanart)
    #     return Response(serializer.data)

    if request.method == 'PUT':
        if fanart.user != request.user:
            return Response({"detail": "You cant edit this fanart"}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        serializer = FanartSerializer(fanart, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if fanart.user != request.user:
            return Response({"detail": "You cant delete this fanart"}, 
                            status=status.HTTP_403_FORBIDDEN)
        
        fanart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def book_fanarts(request, book_id):
    try:
        book = Book.objects.get(bookid=book_id)
    except Book.DoesNotExist:
        return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
    
    fanarts = Fanart.objects.filter(book=book).order_by('-created_at')
    serializer = FanartSerializer(fanarts, many=True)
    return Response(serializer.data)

#for quering google books by id (for landing page, booklist)
URL = "https://www.googleapis.com/books/v1/volumes/"

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_book_details_landing(request, book_id):
    try:
        # Check if the book already exists
        book = Book.objects.get(bookid=book_id)
        book.view_count += 1  # increment the count
        book.save()
    except Book.DoesNotExist:
        # If not, call Google Books API
        url = f'https://www.googleapis.com/books/v1/volumes/{book_id}?key={settings.GOOGLE_BOOKS_API_KEY}'
        response = requests.get(url)
        if response.status_code != 200:
            return Response({'error': 'Book not found'}, status=404)

        data = response.json().get('volumeInfo', {})
        # Create and save book instance
        book = Book.objects.create(
            bookid=book_id,
            title=data.get('title'),
            authors=data.get('authors', []),
            publisher=data.get('publisher'),
            published_date=data.get('publishedDate'),
            description=data.get('description'),
            main_category=data.get('mainCategory'),
            categories=data.get('categories', []),
            page_count=data.get('pageCount'),
            language=data.get('language'),
            google_average_rating=data.get('averageRating'),
            google_ratings_count=data.get('ratingsCount'),
            google_popularity=round(data.get('averageRating') * math.log10(data.get('ratingsCount') + 1), 2)
            )

    # Serialize book and its reviews
    reviews = Review.objects.filter(bookid=book.bookid).exclude(message__isnull=True)

    friends = User.objects.filter(Q(friendship_initiated__user2=request.user) | Q(friendship_received__user1=request.user))

    friends_reviews = reviews.filter(user__in=friends)
    others_reviews = reviews.exclude(user__in=friends)

    sort_by = request.GET.get('ordering')
    if sort_by == "rating_high_to_low":
        friends_reviews = friends_reviews.order_by('-rating')
        others_reviews = others_reviews.order_by('-rating')
    elif sort_by == "newest":
        friends_reviews = friends_reviews.order_by('-created_at')  
        others_reviews = others_reviews.order_by('-created_at')

    reviews = list(chain(friends_reviews, others_reviews))

    #for books by same author
    author_name = book.authors[0]
    author_url = f'https://www.googleapis.com/books/v1/volumes/q=inauthor:{author_name}&maxResults=7&key={settings.GOOGLE_BOOKS_API_KEY}'
    author_res = requests.get(author_url).json()
    similar_by_author = []
    for item in author_res.get('items', []):
        if item['id'] != book_id:
            info = item.get('volumeInfo', {})
            similar_by_author.append({
                'bookid': item['id'],
                "cover": info.get("imageLinks", {}).get("thumbnail"),
                'title': info.get('title'),
                # 'thumbnail': info.get('imageLinks', {}).get('thumbnail')
            })

    #for similar books
    similar_by_category = []
    if book.main_category:
        category = book.main_category
        similar_books = Book.objects.filter(main_category__iexact=category).exclude(bookid=book.bookid).order_by("-google_popularity")[:10]  # you can adjust the number

    for b in similar_books:
        similar_by_category.append({
            "bookid": b.bookid,
            "title": b.title,
            "cover": b.cover,
            "author": b.authors[0] if isinstance(b.authors, list) else b.authors,
        })
        
    #if book is available to rent/buy
    normalized_title = book.title.replace(" ", "").lower()
    rent_available = 1 if Rent.objects.annotate(norm_title=Lower(Replace('title', Value(" "), Value("")))).filter(norm_title=normalized_title, city=request.user.city).exists() else 0
    buy_available = 1 if WantToSell.objects.annotate(norm_title=Lower(Replace('title', Value(" "), Value("")))).filter(norm_title=normalized_title, city=request.user.city).exists() else 0

    book_serializer = BookSerializer(book)
    review_serializer = ReviewSerializer(reviews, many=True)

    return Response({
        'book': book_serializer.data,
        'reviews': review_serializer.data,
        'similar_by_author': similar_by_author,
        'similar_by_category': similar_by_category,
        'availability': {
            'rent_available': rent_available,
            'buy_available': buy_available}
    })


def search_google_books(query, field):
    url = f"https://www.googleapis.com/books/v1/volumes?q={field}:{query}&maxResults=20&key={settings.GOOGLE_BOOKS_API_KEY}"
    res = requests.get(url)
    books = []
    if res.status_code == 200:
        items = res.json().get("items", [])
        for item in items:
            info = item.get("volumeInfo", {})
            books.append({
                "title": info.get("title", "Unknown Title"),
                "author": info.get("authors", ["Unknown Author"])[0],
                "cover": info.get("imageLinks", {}).get("thumbnail", None)
            })
    return books

@api_view(['GET', 'POST'])
def discover_books(request):

    if request.method == 'GET':
        search_type = request.GET.get('search_type')
        query = request.GET.get('q')
        if not search_type or not query:
            return Response({"error": "Missing search_type or query."}, status=400)
        
        if search_type == 'title':
            return Response(search_google_books(query, 'intitle'))
        elif search_type == 'author':
            return Response(search_google_books(query, 'inauthor'))
        else:
            return Response({"error": "Invalid search_type. Use 'title' or 'author'."}, status=400)

    if request.method == 'POST':
        genre = request.data.get('genre')
        if not genre:
            return Response({"error": "Genre not provided."}, status=400)

        try:
            import os
            from django.conf import settings
            file_path = os.path.join(settings.BASE_DIR, 'base', 'genres.json')
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except FileNotFoundError:
            return Response({"error": "genres.json not found."}, status=500)

        if genre not in data:
            return Response({"error": f"No data found for genre '{genre}'."}, status=404)

        books = data[genre]
        if len(books) <= 20:
            return Response(books)
        else:
            return Response(random.sample(books, 20))


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def default_booklist_view(request):
    if request.method == 'GET':
        reading = DefaultBookList.objects.filter(user=request.user, type='reading')
        want_to_read = DefaultBookList.objects.filter(user=request.user, type='want_to_read')
        read = DefaultBookList.objects.filter(user=request.user, type='read')

        reading_serializer = DefaultBookListEntrySerializer(reading, many=True)
        want_to_read_serializer = DefaultBookListEntrySerializer(want_to_read, many=True)
        read_serializer = DefaultBookListEntrySerializer(read, many=True)

        return Response({
            'reading': reading_serializer.data,
            'want_to_read': want_to_read_serializer.data,
            'read': read_serializer.data
        })
    elif request.method == 'POST':
        book_id = request.data.get('book')
        list_type = request.data.get('type')

        if not book_id or not list_type:
            return Response({"error": "Both book and type are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if book already exists in any default list
        existing_entry = DefaultBookList.objects.filter(user=request.user, book_id=book_id).first()

        if existing_entry:
            if existing_entry.type == list_type:
                return Response({"detail": f"This book is already in your '{list_type}' list."},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                # Remove from other default list
                existing_entry.delete()
        if list_type=='read':
            profile = request.user.profile
            profile.points += 20
            profile.save()
        # Now add to the new default list
        serializer = DefaultBookListEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                "message": f"Book successfully added to '{list_type}' list.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        book_id = request.data.get('book')
        list_type = request.data.get('type')

        if not book_id or not list_type:
            return Response({"error": "Both book and type are required to delete."},
                            status=status.HTTP_400_BAD_REQUEST)

        entry = DefaultBookList.objects.filter(user=request.user, book_id=book_id, type=list_type).first()

        if not entry:
            return Response({"detail": "Book not found in specified list."},
                            status=status.HTTP_404_NOT_FOUND)

        entry.delete()
        return Response({"message": f"Book removed from '{list_type}' list."}, status=status.HTTP_204_NO_CONTENT)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_pages_read(request, pk):
    entry = get_object_or_404(DefaultBookList, pk=pk, user=request.user)
    pages_read = request.data.get('pages_read')

    if not pages_read:
        return Response({"error": "Please provide pages_read"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        pages_read = int(pages_read)
        entry.pages_read = pages_read
        entry.save()
        return Response({"message": "Pages read updated successfully.",
                         "progress": entry.progress_percentage})
    except ValueError:
        return Response({"error": "pages_read must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def main_landing_page(request):
    user.profile.update_daily_streak()
    user = request.user
    # most viewed books
    hottest_books = Book.objects.order_by('-view_count')[:10]
    hottest_data = BookSerializer(hottest_books, many=True).data

    # books marked as read
    read_books = DefaultBookList.objects.filter(user=user, type='read').select_related('book')

    # TOP 5 AUTHORS
    authors = [book.book.authors for book in read_books if book.book.authors]
    flat_authors = [a.strip() for author in authors for a in author.split(",")]
    top_authors = [a for a, _ in Counter(flat_authors).most_common(5)]

    # Fetch 5 books by these authors (not already read)
    read_ids = [book.book.bookid for book in read_books]
    author_recs = []
    for author in top_authors:
        query = f"https://www.googleapis.com/books/v1/volumes?q=inauthor:{author}&maxResults=3&key={settings.GOOGLE_BOOKS_API_KEY}"
        res = requests.get(query)
        if res.status_code == 200:
            for item in res.json().get("items", []):
                bid = item.get("id")
                if bid not in read_ids:
                    author_recs.append({
                        "bookid": bid,
                        "title": item["volumeInfo"].get("title"),
                        "cover": item["volumeInfo"].get("imageLinks", {}).get("thumbnail"),
                        "author": author
                    })

    # Get all categories from read books
    read_books = BookList.objects.filter(user=request.user, type="read").select_related("book")
    all_cats = []

    for bl in read_books:
        categories = bl.book.categories if isinstance(bl.book.categories, list) else []
        all_cats.extend([cat.strip().lower() for cat in categories])

    # Get top 3 categories 
    cat_counter = Counter(all_cats)
    top_cats = [cat for cat, _ in cat_counter.most_common(3)]

    # Fetch matching books from Book model
    read_ids = read_books.values_list("book__bookid", flat=True)
    category_recs = []

    for cat in top_cats:
        matches = Book.objects.filter(main_category__iexact=cat).exclude(bookid__in=read_ids).order_by("-google_popularity")[:5]

        for book in matches:
            category_recs.append({
                "bookid": book.bookid,
                "title": book.title,
                "cover": book.cover,
                "author": book.authors[0] if isinstance(book.authors, list) else book.authors,
                "mainCategory": book.main_category,
            })

    category_recs = category_recs[:15]

    # what your friends are reading
    friends = Friendship.objects.filter(Q(user1=user) | Q(user2=user))
    friend_ids = set()
    for f in friends:
        if f.user1 == user:
            friend_ids.add(f.user2.id)
        else:
            friend_ids.add(f.user1.id)

    friends_books = BookList.objects.filter(user__id__in=friend_ids, type='reading').select_related('book').order_by('-last_updated')[:15]
    friends_reading = [
        {
            "bookid": bl.book.bookid,
            "title": bl.book.title,
            "cover": bl.book.cover,
            "friend": bl.user.username,
            "last_updated": bl.last_updated
        }
        for bl in friends_books
    ]


    return Response({
        "hottest_books": hottest_data,
        "recommended_by_authors": author_recs[:15],
        "recommended_by_category": category_recs[:15],
        "friends_reading": friends_reading
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_booknest_wrapped(request):
    user = request.user
    read_books = DefaultBookList.objects.filter(user=user, type='read', book__isnull=False).select_related('book')

    if not read_books.exists():
        return Response({"message": "You haven't completed any books yet."})

    total_pages = 0
    author_counter = Counter()
    genre_counter = Counter()
    month_counter = Counter()
    total_days = 0
    read_durations = []

    fastest_book = None
    min_days = float('inf')

    for entry in read_books:
        book = entry.book
        total_pages += entry.pages_read or 0

        author_counter.update(book.authors or [])

        genre_counter.update(book.categories or [])

        if entry.completion_time:
            month = entry.completion_time.month
            month_counter[month] += 1

        if entry.start_time and entry.completion_time:
            duration = (entry.completion_time - entry.start_time).days
            if duration >= 0:
                total_days += duration
                read_durations.append(duration)

                if duration < min_days:
                    min_days = duration
                    fastest_book = book.title

    top_authors = [author for author, _ in author_counter.most_common(3)]
    top_genres = [genre for genre, _ in genre_counter.most_common(3)]

    max_books_month = max(month_counter.items(), key=lambda x: x[1])[0]
    month_name = calendar.month_name[max_books_month]

    avg_time = round(sum(read_durations) / len(read_durations), 2) if read_durations else None

    user_books_count = read_books.count()

    total_users = DefaultBookList.objects.filter(type='read').values('user').distinct().count()
    user_rank = DefaultBookList.objects.filter(type='read') \
        .values('user') \
        .annotate(count=Sum('pages_read')) \
        .filter(count__lt=total_pages).count()
    percentile = round((user_rank / total_users) * 100) if total_users else 0

    data = {
        "top_authors": top_authors,
        "top_genres": top_genres,
        "max_books_read_month": month_name,
        "avg_days_to_read": avg_time,
        "fastest_read_book": fastest_book,
        "reader_percentile": percentile,
        "total_pages_read": total_pages,
        "total_books_read": user_books_count,
    }

    return Response(data)

def combined_user_profile(request):
    user = request.user
    user_profile = user.profile

    # Get user's friends

    #get user's default booklists
    reviews = UserReview.objects.filter(reviewee=user).order_by('-created_at')
    reading = DefaultBookList.objects.filter(user=request.user, type='reading')
    want_to_read = DefaultBookList.objects.filter(user=request.user, type='want_to_read')
    read = DefaultBookList.objects.filter(user=request.user, type='read')
    # Get user's fanarts
    fanarts = Fanart.objects.filter(user__id=request.user).order_by('created_at')
    # Get user's posts
    posts = Post.objects.filter(user__id=request.user).order_by('-created_at')
    # Get user's sales and rentals
    sales = WantToSell.objects.filter(user__id=request.user)
    rents = Rent.objects.filter(user__id=request.user)
    # Get user's book list
    booklists = BookList.objects.all()
    serializer = BookListSerializer(booklists, many=True)
    final_response = serializer.data
    for data in final_response: data.pop("books") 
    # Get user's reviews
    reviews = UserReview.objects.filter(reviewee=user).order_by('-created_at')


    # Serialize data
    booklist_serializer = BookListSerializer(final_response, many=True)
    fanart_serializer = FanartSerializer(fanarts, many=True)
    post_serializer = PostSerializer(posts, many=True)
    review_serializer = UserReviewSerializer(reviews, many=True)
    sale_serializer = WantToSellSerializer(sales, many=True)
    rental_serializer = RentSerializer(rents, many=True)
    reading_serializer = DefaultBookListEntrySerializer(reading, many=True)
    want_to_read_serializer = DefaultBookListEntrySerializer(want_to_read, many=True)
    read_serializer = DefaultBookListEntrySerializer(read, many=True)


    data = {
        'user_profile': {
            'username': user.username,
            'name': user_profile.name,
            'contact_no': user_profile.contact_no,
            'city': user_profile.city,
            'pincode': user_profile.pincode,
            'country': user_profile.country,
            # 'email': user.email,
            'bio': user_profile.bio,
            # 'profile_picture': user_profile.profile_picture.url if user_profile.profile_picture else None,
            'points': user_profile.points,
            'owner_avg_rating': user_profile.get_average_rent_rating(),
        },
        'book_list': booklist_serializer.data,
        'reading': reading_serializer.data,
        'want_to_read': want_to_read_serializer.data,
        'read': read_serializer.data,
        'fanarts': fanart_serializer.data,
        'posts': post_serializer.data,
        'reviews': review_serializer.data,
        'sales': sale_serializer.data,
        'rentals': rental_serializer.data,
    }

    return Response(data)
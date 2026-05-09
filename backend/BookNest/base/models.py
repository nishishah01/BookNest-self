from datetime import date, timedelta
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
from django.core.validators import MinValueValidator, MaxValueValidator

# main models

#books that are viewed atleast once will be saved here
class Book(models.Model):
    bookid = models.AutoField(primary_key=True)
    title = models.TextField()
    authors = models.JSONField(default=list, blank=True)
    publisher = models.TextField(null=True, blank=True)
    published_date = models.CharField(max_length=20, null=True, blank=True)  # do you wanna make this datefield
    description = models.TextField(null=True, blank=True)
    main_category = models.TextField(null=True, blank=True)
    categories = models.JSONField(default=list, blank=True)
    page_count = models.IntegerField(null=True, blank=True)
    language = models.CharField(max_length=10, null=True, blank=True)
    view_count = models.IntegerField(default=1)
    google_average_rating = models.FloatField(null=True, blank=True)
    google_ratings_count = models.IntegerField(null=True, blank=True)
    google_popularity = models.FloatField(null=True, blank=True)

    #cover = 

    def __str__(self):
        return self.title


class Profile(models.Model):
    user        = models.OneToOneField(User, null=False, on_delete=models.CASCADE)
    name        = models.CharField(max_length=20) # this is not username, its just name (to fetch username, use profile_instance.user.username)
    contact_no  = PhoneNumberField()
    pincode     = models.IntegerField(default=0, blank=True)                # dont make it compulsory to enter pincode
    city        = models.CharField(max_length=200, blank=True)              # dont make it compulsory to enter city
    country     = models.CharField(max_length=200, null=False, blank=False) # but entering country is compulsory
    bio         = models.TextField(max_length=200,null=True,blank=True)
    points      = models.IntegerField(default=0)
    last_visit_date = models.DateField(null=True, blank=True)
    visit_streak    = models.IntegerField(default=0)
    lat = models.FloatField(null=True,blank=True)
    lng = models.FloatField(null=True,blank=True)
    level = models.IntegerField(default=0) # level is calculated based on points, so it will be updated automatically when points are updated
    
    def save(self, *args, **kwargs):
        self.level = self.calculate_level()  # dynamically set level
        super().save(*args, **kwargs)

    def get_average_rent_rating(self):
        reviews = self.user.received_user_reviews.all()
        if reviews.exists():
            return round(sum([r.rating for r in reviews]) / reviews.count(), 2)
        return None

    def calculate_level(self):
        base=0
        level = 0
        total = 0
        while self.points >= total + base * (level + 1):
            level += 1
            total += base * level
        self.level=level
        self.save()
    def update_daily_streak(self):
        today = date.today()

        if self.last_visit_date == today:
            return

        if self.last_visit_date == today - timedelta(days=1):
            self.visit_streak += 1
        else:
            self.visit_streak = 1  

        self.last_visit_date = today
        self.points += 1  

        if self.visit_streak >= 7:
            self.visit_streak = 0

        self.save()
    
    def __str__(self):
        return f"ID{self.id} - {self.user.username}"

class Post(models.Model):
    user        = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name="posts") #user can post a post
    message     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ID{self.id} - Post by {self.user.username}"


# remaining models

class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(null=False)
    message = models.TextField(null=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.book.title}"

class Comment(models.Model):
    post        = models.ForeignKey(Post, null=False, on_delete=models.CASCADE, related_name="comments")
    user        = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name="comments")
    message     = models.TextField()
    reply       = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies")

    def __str__(self):
        return f"ID{self.id} - Comment by {self.user.username} on Post {self.post.id}"

class Fanart(models.Model):
    title       = models.CharField(max_length=200)
    author      = models.CharField(max_length=255) 
    user        = models.ForeignKey(User, null=False, on_delete=models.CASCADE, related_name="fanarts")
    book        = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="fanarts",null=True, blank=True)   
    image       = models.ImageField(upload_to="fanarts/")
    created_at  = models.DateTimeField(auto_now_add=True)
    # todo: Claudinary integration for images storage

    def __str__(self):
        return f"ID{self.id} - Fanart by {self.user.username}"

class Friendship(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friendship_initiated")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friendship_received")

    class Meta:
        unique_together = ("user1", "user2")
        # Prevents duplicate friendships (eg. p1 -> p2 and p2 -> p1)

    def __str__(self):
        return f"ID{self.id} - {self.user1.username} is friend of {self.user2.username}"
    
class BookList(models.Model):
    book_list_id = models.AutoField(primary_key=True)
    name         = models.CharField(max_length=255)
    user         = models.ForeignKey(User, on_delete=models.CASCADE)  
    books        = models.ManyToManyField(Book,blank=True)  #ids of all books in booklist

    def __str__(self):
        return self.name

class Rent(models.Model):
    rent_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rents")
    price_per_day = models.DecimalField(max_digits=6, decimal_places=2)
    deposit = models.DecimalField(max_digits=6, decimal_places=2, default=0, null=True,blank=True,)
    condition = models.TextField()
    status = models.CharField(max_length=50, choices=[('Available', 'Available'), ('Rented', 'Rented')])
    image = models.ImageField(upload_to='book_images/', null=True, blank=True)
    lat = models.FloatField(null=True,blank=True)
    lng = models.FloatField(null=True,blank=True)

    def __str__(self):
        return f"{self.title} - {self.status}"

class UserReview(models.Model):
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_user_reviews")  # person being reviewed
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="given_user_reviews")
    
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=0)
    review_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Link to either Rent or WantToSell for context
    rent = models.ForeignKey('Rent', on_delete=models.CASCADE, null=True, blank=True)
    sell = models.ForeignKey('WantToSell', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.reviewee.username}"

class WantToSell(models.Model):
    sell_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.TextField()
    image = models.ImageField(upload_to='book_images/', null=True, blank=True)
    # todo: Claudinary integration for images storage

    def __str__(self):
        return f"{self.title} - {self.price}"

class DefaultBookList(models.Model):
    LIST_TYPES = [
        ('reading', 'Reading'),
        ('read', 'Read'),
        ('want_to_read', 'Want to Read'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=LIST_TYPES)
    
    pages_read = models.PositiveIntegerField(default=0)
    start_time = models.DateTimeField(null=True, blank=True)
    last_updated = models.DateTimeField(null=True, blank=True)
    completion_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'book')  # Ensures one default list per book per user

    def save(self, *args, **kwargs):
        self.last_updated = timezone.now()
        if self.type == 'reading' and not self.start_time:
            self.start_time = timezone.now()

        if self.type == 'read':
            self.pages_read = self.book.page_count
            if not self.completion_time:
                self.completion_time = timezone.now()

        super().save(*args, **kwargs)

    @property
    def progress_percentage(self):
        if self.book.page_count:
            return min(round((self.pages_read / self.book.page_count) * 100), 100)
        return 0

    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.type})"


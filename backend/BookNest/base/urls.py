from django.urls import path, include
from .views import *

urlpatterns = [
    path("auth/", include("base.oauth.urls")),

    # profile
    path("get-profile/", get_profile_details, name="getProfileDetails"),
    path("update-profile/", update_profile_details, name="updateProfileDetails"),
    path('set-location/', set_user_location, name='set_user_location'),
    path('user/profile/<int:user_id>/', combined_user_profile, name='user_profile'),


    #returns books of a genre and for search by title/author
    path('discover/', discover_books, name='discover_books'), #put discover/?title=xyz or discover/?author=xyz or post request with genre=xyz
  
    #book landing: fetches details of a particular book and its reviews
    path('books/<str:book_id>/details/', get_book_details_landing, name='book_landing_page'),

    # friendships
    path("user/get-friends/", get_friends, name="getFriends"),

    #booklist
      # to get list of booklists (does not provide actual books' list)
    path('booklists/', booklist_list, name='booklist-list'),
      # to get all books in the booklist
    path('booklists/<int:pk>/', booklist_detail, name='booklist-detail'),
    path('booklists/default/', default_booklist_view, name='default_booklist'),
    path('booklists/default/<int:pk>/update-pages/', update_pages_read, name='update_pages_read'),

    #rent
    path('rent/', rent_list, name='rent-list'),
    path('rent/<int:pk>/', rent_detail, name='rent-detail'),

    #want to sell
    path('wants-to-sell/', want_to_sell_list, name='want-to-sell-list'),
    path('wants-to-sell/<int:pk>/', want_to_sell_detail, name='want-to-sell-detail'),

    #rent/buy common page
    path('rent_buy_common/', combined_search, name='rent_buy_common'),
    #post
    path('posts/', post_list, name='post_list'),
    path('posts/<int:pk>/',post_detail, name='post_detail'),


    #review
    path('reviews/create/', create_review, name='create_review'),
    path('reviews/<int:pk>/', review_detail, name='review_detail'),


    #fanart
    path('fanarts/', fanart_list, name='fanart_list'),
    path('fanarts/<int:pk>/', fanart_detail, name='fanart_detail'),
    path('books/<int:book_id>/fanarts/', book_fanarts, name='book_fanarts'),
    
    #user reviews
    path('user/<int:user_id>/reviews/', get_user_reviews, name='user-reviews'),
    #add user review
    path('add-userreview/', add_user_review, name='add_user_review'),

    #user wrapped
    path('user/wrapped/', user_booknest_wrapped, name='user-wrapped'),
]

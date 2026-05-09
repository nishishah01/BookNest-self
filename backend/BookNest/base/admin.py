from django.contrib import admin
from .models import *

# main models
admin.site.register(Post)
admin.site.register(Book)
admin.site.register(Profile)

# remaining models
admin.site.register(Review)
admin.site.register(Comment)
admin.site.register(Fanart)
admin.site.register(Friendship)
admin.site.register(BookList)
admin.site.register(Rent)
admin.site.register(WantToSell)
admin.site.register(UserReview)
admin.site.register(DefaultBookList)
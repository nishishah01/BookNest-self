# Backend Stuff
<br>

### Packages Required<br>
Run these in command prompt of project directory:<br>
`pip install django`<br>
`pip install djangorestframework`<br>
`pip install djangorestframework-simplejwt`<br>
`pip install django-cors-headers`<br>
`pip install django-phonenumber-field`<br>
`pip install phonenumbers`<br>
`pip install Pillow`<br>
<br>

### How to start Server<br>
To start the django server, run this command in terminal:<br>
`python manage.py runserver`<br>
<br>

### Documentation / URLs:<br>

API Endpoints: [Postman Workspace](https://web.postman.co/workspace/ecb77141-f5a0-4265-82fa-76a704d4690a/collection/34557995-e346894d-897a-434e-b880-da451dbb3de1)

server_link: `http://127.0.0.1:8000`<br>

- Available Routes for authentication<br>
Link: `server_link/base/auth/`<br>

- Get Access & Refresh Token to signin<br>
Method: `POST`<br>
Headers: `"Content-Type": "application/json"`<br>
Body: (JSON) `{"username": [username], "password": [password]}`<br>
Link: `server_link/base/auth/token/`<br>

- Update the tokens using refresh token<br>
(current refresh token will get blacklisted and new refresh token should be used)<br>
Method: `POST`<br>
Headers: `"Content-Type": "application/json"`<br>
Body: (JSON) `{"refresh": [refresh]`<br>
Link: `server_link/base/auth/token/refresh/`<br>

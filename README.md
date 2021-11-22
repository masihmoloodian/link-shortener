# Url Shortener

## Description

Implement url expiration with MongoDB TTL(Note: It is done with some delay)  
Implement OTP with redis  
Default link expiration time set with DEFAULT_EXPIRATION_TIME  

Note: Redirect not works on swagger and if you are using private url its works on background(Get error) and OTP has expired

## Requiremnt

-   MongoDB
-   Redis

## Run

Just run: docker-compose up --build

Swagger Running on:
http://0.0.0.0:3000/docs/

# Start the server

Install all dependencies by running `npm i`

Create a file named `.env` in the directory of the "server" with the following content:

```
DATABASE_URL=mongodb://localhost/my_database
```

It is strongly encouraged to install docker (https://docs.docker.com/desktop/) and 
start all external systems like mongo db using:

```
docker-compose up
```

When adding new services, also consider adding them to the docker-compose file.

## Configuration (env variables)

### Required for auth features

```env
# Can be any value. Long hash recommended
EMAIL_SECRET=15d...23f
TOKEN_SECRET=3b1...c27

MAIL_HOST=mail.yourmailhost.com
MAIL_USER=user@yourmailhost.com
MAIL_PW=p4s5w0rD
```
### Required for file storage

```env
AWS_ACCESS_KEY_ID=XXXXXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
S3_BUCKET_NAME=bucket_name
```
### Optional

```env
# JWT & Refresh token expiration time. They default to 1h and 180d respectively.
JWT_TOKEN_TTL=1h
REFRESH_TOKEN_TTL=180d
```
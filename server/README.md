# Start the server

Create a file named `.env` in the directory of the "server" with the following content:

```
DATABASE_URL=localhost:27017
```

It is strongly encouraged to install docker (https://docs.docker.com/desktop/) and 
start all external systems like mongo db using:

```
docker-compose up
```

When adding new services, also consider adding them to the docker-compose file.
<p align="center">
  <img src=".readme/stratbook_icon.svg" width="256">
</p>


__Web application to collaboratively manage strategies & utilities in Valve's popular competitive FPS Counterstrike: Global Offensive__

__Live Version [here!](https://stratbook.pro)__

## Features

✅ Add & manage your team

✅ Add & manage strats

✅ Add & manage utilities

✅ Link teammates & utilities in the powerful strat editor

✅ Teammates see changes in real-time

✅ Real-time tactics board to plan out strategies


## Table of Content

- [Features](#features)
- [Table of Content](#table-of-content)
- [Technologies](#technologies)
  - [Client/Frontend](#clientfrontend)
  - [Server/Backend](#serverbackend)
  - [Landingpage](#landingpage)
- [Get started (local setup)](#get-started-local-setup)
  - [Server + Client (Docker)](#server--client-docker)
  - [Server (Local)](#server-local)
  - [Client (Local)](#client-local)

## Technologies

### Client/Frontend

- Vue 2
- Vue CLI
- Vuex
- Vue Class Components & Property Decorator
- Typescript
- Socket.io-Client
- SCSS
- Konva

### Server/Backend

- Node.js
- Express
- MongoDB/Mongoose
- Socket.io
- Bcrypt
- JWT

### Landingpage

- Next.js

## Get started (local setup)

### Server + Client (Docker)

- install [docker-compose](https://docs.docker.com/compose/install/)
- Run `docker-compose up`
- Navigate to http://localhost:8080 and voilá

### Server (Local)

- Navigate to the /server directory
- Run `npm i` to install a
ll dependencies
- Create an `.env` file and add the required environment variables documented [here](https://github.com/JH1ller/csgo-stratbook/blob/master/server/README.md)
- Run `npm run serve` to start the server in development mode
### Client (Local)

- Navigate to the /client directory.
- Run `npm i` to install all dependencies
- Run `npm run serve` to serve the web client in development mode with HMR



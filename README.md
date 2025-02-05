<p align="center">
  <img src=".readme/stratbook_icon.svg" width="256">
</p>


__Web & Desktop application to collaboratively manage strategies & utilities in Valve's popular competitive FPS Counterstrike: Global Offensive__

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
  - [Windows Desktop Client (Local)](#windows-desktop-client-local)

## Technologies

### Client/Frontend

- Vue 2
- Vue CLI
- Vuex
- Vue Class Components & Property Decorator
- Electron
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

### Windows Desktop Client (Local)

- Navigate to the /client directory.
- Download [GTK](https://download.gnome.org/binaries/win64/gtk+/2.22/gtk%2B-bundle_2.22.1-20101229_win64.zip) and extract to "C:\GTK\"
- Run `npm i` to install all dependencies
- Run `npm run electron:serve` to start the app in development mode with HMR
- Run `npm run electron:build` to build a windows installer



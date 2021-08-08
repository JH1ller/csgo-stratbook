<p align="center">
  <img src=".readme/logo.png" width="256">
</p>


__Vue-Typescript application to manage strategies in Valve's popular competitive FPS Counterstrike: Global Offensive__

__Live Version [here!](https://stratbook.live)__

![electron](https://img.shields.io/badge/electron-9.4.0-blue.svg)
![vue](https://img.shields.io/badge/vue-2.6.11-blue.svg)
![typescript](https://img.shields.io/badge/typescript-4.1.3-blue.svg)
![socket.io](https://img.shields.io/badge/socket.io-2.3.0-blue.svg)

## Table of Content

- [Table of Content](#table-of-content)
- [Technologies](#technologies)
  - [Client/Frontend](#clientfrontend)
  - [Server/Backend](#serverbackend)
  - [Landingpage](#landingpage)
- [Get started (local setup)](#get-started-local-setup)
  - [Server + Client (Docker)](#server--client-docker)
  - [Server (Local)](#server-local)
  - [Server (Local)](#server-local-1)
  - [Server (Local)](#server-local-2)
  - [Server (Local)](#server-local-3)
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

### Server/Backend

- Node.js
- Express
- MongoDB/Mongoose
- Socket.io
- Bcrypt
- JWT

### Landingpage

- Nuxt (SSG)
- Nuxt Class Components

## Get started (local setup)

### Server + Client (Docker)

- install [docker-compose](https://docs.docker.com/compose/install/)
- Run `docker-compose up`
- Navigate to http://localhost:8080 and voilá

### Server (Local)

- install [docker-compose](https://docs.docker.com/compose/install/)
- Run `docker-compose up`
- Navigate to http://localhost:8080 and voilá

### Server (Local)

- install [docker-compose](https://docs.docker.com/compose/install/)
- Run `docker-compose up`
- Navigate to http://localhost:8080 and voilá

### Server (Local)

- install [docker-compose](https://docs.docker.com/compose/install/)
- Run `docker-compose up`
- Navigate to http://localhost:8080 and voilá

### Server (Local)

- Install ``git-lfs`` before cloning the repo.
- Clone the repo
- Navigate to the /server directory
- Run `npm i` to install all dependencies
- Create an `.env` file and add the required environment variables documented [here](https://github.com/JH1ller/csgo-stratbook/blob/master/server/README.md)
- Run `npm run dev` to start the server in development mode
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



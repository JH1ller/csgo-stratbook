<p align="center">
  <img src=".readme/logo.png" width="256">
</p>


__Vue-Typescript application to manage strategies in Valve's popular competitive FPS Counterstrike: Global Offensive__

__Live Version [here!](https://stratbook.live)__

![electron](https://img.shields.io/badge/electron-8.3.2-blue.svg)
![vue](https://img.shields.io/badge/vue-2.6.11-blue.svg)
![typescript](https://img.shields.io/badge/typescript-3.7.5-blue.svg)
![socket.io](https://img.shields.io/badge/socket.io-2.3.0-blue.svg)

## Table of Content

- [Table of Content](#table-of-content)
- [Technologies](#technologies)
  - [Client/Frontend](#clientfrontend)
  - [Server/Backend](#serverbackend)
  - [Landingpage](#landingpage)
- [Get started (local setup)](#get-started-local-setup)
  - [Server](#server)
  - [Client](#client)

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

### Server

- Navigate to the /server directory
- Run `npm i` to install all dependencies
- Create an `.env` file and add the required environment variables documented [here](https://github.com/JH1ller/csgo-stratbook/blob/master/server/README.md)
- Run `npm run dev` to start the server in development mode
### Client

- Navigate to the /client directory.
- Run `npm i` to install all dependencies
- Run `npm run serve` to serve the web client in development mode, or `npm run electron:serve` for the desktop app

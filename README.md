<p align="center">
  <img src=".readme/logo_dark.png" width="128">
</p>

## CSGO Stratbook

Vue-Typescript application to manage strategies in Valve's popular competitive FPS Counterstrike: Global Offensive
Also available as desktop client

![electron](https://img.shields.io/badge/electron-8.3.2-blue.svg)
![vue](https://img.shields.io/badge/vue-2.6.11-blue.svg)
![typescript](https://img.shields.io/badge/typescript-3.7.5-blue.svg)
![socket.io](https://img.shields.io/badge/socket.io-2.3.0-blue.svg)

<img src="https://i.imgur.com/kf87rQD.png" width="512"> <img src="https://i.imgur.com/UJehjxX.png" width="512">


### Table of Content

- [CSGO Stratbook](#csgo-stratbook)
  - [Table of Content](#table-of-content)
  - [Technologies](#technologies)
    - [Client/Frontend](#clientfrontend)
    - [Server/Backend](#serverbackend)
  - [Goals](#goals)
  - [Minimum OS Version requirements](#minimum-os-version-requirements)

### Technologies

#### Client/Frontend

- Vue 2
- Vue CLI
- Vuex
- Vue Class Components & Property Decorator
- Electron
- Typescript
- Socket.io-Client
- SCSS

#### Server/Backend

- Node.js
- Express
- MongoDB/Mongoose
- Socket.io
- Bcrypt
- JWT

### Features

- [x] User authentication
- [x] JWT authenticated REST api to create & manage strategies
- [x] Team creation & team profiles
- [x] Filter strategies
- [x] Live DB via socket.io

- [ ] Steam OAuth
- [ ] Settings Menu
- [ ] Player Profiles


### Minimum OS Version requirements

- Windows 7
- macOS 10.10 (Yosemite)
- Linux: Ubuntu 12.04, Fedora 21, Debian 8

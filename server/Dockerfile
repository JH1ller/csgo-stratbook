FROM node:18.16

WORKDIR /usr/src/app/server

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "serve"]
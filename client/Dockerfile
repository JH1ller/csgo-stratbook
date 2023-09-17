FROM node:18.16
WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]
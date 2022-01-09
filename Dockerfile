#!/bin/sh
FROM node:16.13.1
WORKDIR /Users/harshrayzada/development/PixCap
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8070
CMD [ "npm", "run", "docker-start-app" ]
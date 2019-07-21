FROM node:10

WORKDIR /code
COPY package*.json ./

COPY . /code
RUN npm install -g

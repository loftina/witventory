FROM node:12.10

RUN mkdir -p /usr/src/app 

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm cache clean --force

RUN npm install

#RUN npm install --save bootstrap@3

COPY ./frontend /usr/src/app
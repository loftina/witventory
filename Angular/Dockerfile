FROM node:12.10

RUN mkdir -p /usr/src/app 

WORKDIR /usr/src/app

COPY ./frontend /usr/src/app

RUN npm cache clean --force

EXPOSE 4200

CMD ["npm", "start"]
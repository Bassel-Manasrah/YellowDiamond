FROM node:iron-alpine 

WORKDIR /yellow

COPY package*.json .
COPY packages ./packages
COPY apps/registry/package*.json ./apps/app/

RUN npm install

WORKDIR /yellow/apps/app/

COPY apps/registry .

CMD [ "npm", "start" ]
FROM node:iron-alpine 

WORKDIR /yellow

COPY package*.json .
COPY packages ./packages
COPY apps/auth/package*.json ./apps/app/

RUN npm install

WORKDIR /yellow/apps/app/

COPY apps/auth/ .

CMD [ "npm", "start" ]




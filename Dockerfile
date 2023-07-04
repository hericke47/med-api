FROM node:16-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run prepare

EXPOSE 3003

CMD [ "npm","run","start:watch" ]


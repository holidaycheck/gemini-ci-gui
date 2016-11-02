FROM node:7-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV NODE_ENV production
RUN npm run build

CMD [ "./server/index.js" ]

EXPOSE 3000

FROM node:carbon
WORKDIR /fusion
COPY ./package.json /fusion
COPY ./package-lock.json /fusion
RUN npm install

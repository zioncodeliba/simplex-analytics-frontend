FROM node:22-alpine

RUN apk add curl
WORKDIR /app
ADD package*.json .
RUN npm i
COPY . .

RUN npm run build
USER node

EXPOSE 3000
CMD npm run start

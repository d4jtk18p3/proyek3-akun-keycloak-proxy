FROM node:15-alpine3.13

COPY . /src/app
WORKDIR /src/app

RUN npm install

CMD ["node", "--experimental-specifier-resolution=node", "src/main.js"]

FROM node:16-alpine3.13

COPY . /src/app
WORKDIR /src/app

RUN npm install --only=production

CMD ["node", "src/main.js"]

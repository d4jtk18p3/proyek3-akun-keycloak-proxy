FROM node:16-alpine3.13

COPY . /src/app
WORKDIR /src/app

RUN set -ex \
 && npm install --only=production

CMD ["node", "src/main.js"]

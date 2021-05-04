FROM node:15-alpine3.13

COPY . /src/app
WORKDIR /src/app

RUN npm install

CMD ["npm", "run", "serve:development"]

FROM node:14.17.0-alpine3.12
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
CMD npm run start

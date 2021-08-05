FROM node:16-alpine as build

WORKDIR /build

RUN npm install -g npm@latest

COPY package.json .

RUN cat package.json

RUN npm install --force

COPY . .

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=build /build/package.json .

RUN npm install --production --force

COPY --from=build /build/dist ./dist

COPY --from=build /build/ormconfig.js .

ENTRYPOINT [ "npm", "start" ]
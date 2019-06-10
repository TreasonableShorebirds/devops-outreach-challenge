FROM node:12.2.0-alpine

COPY . /app
WORKDIR /app
RUN yarn install --silent --no-optional

ENTRYPOINT ["yarn", "start"]

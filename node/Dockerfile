FROM node:12.2.0-alpine

COPY . /app
WORKDIR /app
RUN npm install --silent --no-optional

ENTRYPOINT ["npm", "start"]

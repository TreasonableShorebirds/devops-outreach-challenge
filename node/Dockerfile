FROM node:12.2.0-alpine

WORKDIR /app
COPY package*.json .

RUN yarn install --silent

# Copy source code
COPY . .

ENTRYPOINT ["yarn", "start"]

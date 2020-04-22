FROM node:12.2.0-alpine

# Prepare app directory
WORKDIR /usr/src/app/
COPY package*.json .
COPY yarn.lock .


# Install dependencies
RUN yarn install --silent

# Copy source code
COPY . .

ENV CI true
ENTRYPOINT ["yarn", "start"]

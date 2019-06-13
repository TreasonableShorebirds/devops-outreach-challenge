FROM node:12.2.0-alpine

# Prepare app directory
WORKDIR /usr/src/app/
COPY package*.json .


# Install dependencies
RUN yarn install --silent

# Copy source code
COPY . .

ENTRYPOINT ["yarn", "start"]

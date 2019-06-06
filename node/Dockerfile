# base image
FROM node:12.2.0-alpine

ADD . /app

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
#COPY package.json /app/package.json
RUN npm install --silent
#RUN npm install express mongoose mongodb -g --silent

# start app
#ENTRYPOINT ["tail","-f", "/dev/null"]
ENTRYPOINT ["npm", "start"]

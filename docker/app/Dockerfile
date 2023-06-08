# MAINTAINER Diao Liu 

FROM node:14.17.3-alpine3.14
RUN apk update && apk add curl


WORKDIR /app
ADD . /app
ADD  package.json /app
ADD .env.example /app/.env


# RUN  npm install
RUN  npm install --production
RUN ls /app

ENV node=dev
HEALTHCHECK --interval=5s --timeout=3s CMD curl -f http://localhost:9527/v1/health || exit 1
# This is the example，need to change to the service real port
EXPOSE 9527



# CMD npm run $node
CMD node app.js

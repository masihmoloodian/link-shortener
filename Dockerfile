FROM node:12-buster-slim

RUN apt update && apt install wait-for-it -y && apt install git -y

WORKDIR /app

COPY ./package.json .
RUN npm i --force

COPY . /app

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]

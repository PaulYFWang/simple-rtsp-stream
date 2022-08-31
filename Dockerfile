FROM node:12

ARG TAPO_USER=default
ENV TAPO_USER ${TAPO_USER}

ARG TAPO_PW=default
ENV TAPO_PW ${TAPO_PW}

WORKDIR /app

COPY package*.json ./

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "node", "app.js" ]

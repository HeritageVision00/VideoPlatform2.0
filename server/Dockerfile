FROM node
WORKDIR /usr/src/app
# RUN apk add --no-cache tzdata
COPY package*.json ./
RUN npm ci --omit=dev

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install ffmpeg -y

COPY . .
CMD ["npm", "start"]
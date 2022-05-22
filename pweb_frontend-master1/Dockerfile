FROM node:16-alpine

EXPOSE 3000

WORKDIR /usr/src/pweb_frontend

COPY ./pweb_frontend-master .

RUN npm install -D

RUN npm run build

CMD ["npm", "run", "preview:lan"]
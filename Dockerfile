FROM node:25-alpine3.22

WORKDIR /opt/node/code-forge

COPY package*.json .

RUN npm i

COPY . .

EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "run", "dev"]
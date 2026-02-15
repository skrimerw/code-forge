FROM node:25-alpine3.22
WORKDIR /opt/node/code-forge
COPY . .
EXPOSE 3000
RUN npm i
CMD ["npm", "run", "dev"]
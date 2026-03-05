FROM node:25-alpine3.23

RUN adduser --disabled-password isolated-user

USER isolated-user

WORKDIR /home/isolated-user

COPY --chown=isolated-user:isolated-user . .

RUN npm i

CMD ["node", "code-runner.js"]


FROM node:25-alpine3.23

RUN adduser --disabled-password isolated-user

USER isolated-user

WORKDIR /home/isolated-user

CMD ["sh", "-c", "node $CODE_FORGE_FILE_NAME"]


FROM node:12 as builder

WORKDIR /app
COPY app /app

RUN yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --production=true



FROM node:12

COPY --from=builder /app/dist/index.js /app/index.js
COPY --from=builder /app/node_modules/ /app/node_modules

EXPOSE 80

CMD ["node", "/app/index.js"]


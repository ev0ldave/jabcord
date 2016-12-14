FROM node:7-alpine

RUN apk add --no-cache \
        libstdc++ \
    && apk add --no-cache --virtual .build-deps \
        binutils-gold \
        gcc \
        libgcc \
        make \
        python

CMD ["node"]

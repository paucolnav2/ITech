FROM alpine:latest

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY simulator.sh .

RUN chmod +x simulator.sh

CMD ["./simulator.sh"]

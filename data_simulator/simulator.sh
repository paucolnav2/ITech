#!/bin/sh

HOST=java
PORT=8080

while true
do
  MESSAGE="373;TEMPERATURE;80"

  echo "$MESSAGE" | nc $HOST $PORT

  echo "Sent: $MESSAGE"

  sleep 2
done

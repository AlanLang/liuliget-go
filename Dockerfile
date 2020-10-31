# Build go
FROM golang:1.15 AS serverBuilder
ARG PLUGIN_HOST="localhost"
COPY . /liuliget
WORKDIR /liuliget
RUN echo $PLUGIN_HOST
RUN go run /usr/local/go/src/crypto/tls/generate_cert.go --host=$PLUGIN_HOST
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o liuliget

# Build web
FROM node:12 AS webBuilder
COPY . /app
WORKDIR /app
RUN npm i \
    && npm run build

FROM scratch

COPY --from=webBuilder /app/build build
COPY --from=serverBuilder /liuliget/liuliget .
COPY --from=serverBuilder /liuliget/cert.pem .
COPY --from=serverBuilder /liuliget/key.pem .

EXPOSE 8080
# 这里跟编译完的文件名一致
ENTRYPOINT  ["./liuliget"]
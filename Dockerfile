# Build web
FROM node:12 AS webBuilder
COPY . /app
WORKDIR /app
RUN npm i \
    && npm run build

# Build go
FROM golang:1.15 AS serverBuilder
COPY . /liuliget
WORKDIR /liuliget
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o liuliget

FROM scratch

COPY --from=webBuilder /app/build build
COPY --from=serverBuilder /liuliget/liuliget .

EXPOSE 80
# 这里跟编译完的文件名一致
ENTRYPOINT  ["./liuliget"]
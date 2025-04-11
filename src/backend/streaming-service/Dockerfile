FROM golang:1.23.6

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o streaming-service .

EXPOSE 8080

CMD ["./streaming-service"]

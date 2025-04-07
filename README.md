# yappie

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

cd proto

protoc --go_out=. --go-grpc_out=. --proto_path=. user/user.proto

go get google.golang.org/grpc
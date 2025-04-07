package main

import (
	"flag"

	pb "github.com/malak-elbanna/yappie/grpc-go-trial/proto/streaming"
)

var (
	port = flag.Int("port", 50051, "The server port")
)

type server struct {
	pb.UnimplementedAudioStreamerServer
}

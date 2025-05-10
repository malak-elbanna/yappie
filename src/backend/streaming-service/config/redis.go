package config

import (
	"context"
	"os"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
	REDIS_HOST := os.Getenv("REDIS_HOST")
	if REDIS_HOST == "" {
		REDIS_HOST = "redis"
	}

	REDIS_PORT := os.Getenv("REDIS_PORT")
	if REDIS_PORT == "" {
		REDIS_PORT = "6379"
	}

	redisAddr := REDIS_HOST + ":" + REDIS_PORT
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "",
		DB:       0,
	})
}

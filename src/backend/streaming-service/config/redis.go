package config

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	REDIS_HOST := os.Getenv("REDIS_HOST")
	if REDIS_HOST == "" {
		REDIS_HOST = "localhost"
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

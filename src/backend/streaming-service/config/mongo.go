package config

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func ConnectDB() *mongo.Client {
	clientOptions := options.Client().ApplyURI("mongodb+srv://smalakelbanna:UrayjmneL4Pzi4KE@cluster0.ufjw6qu.mongodb.net/?retryWrites=true&w=majority")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to mongo")
	return client
}

func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	return client.Database("audiobooks_db").Collection(collectionName)
}

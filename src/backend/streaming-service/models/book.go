package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Chapter struct {
	Title    string `bson:"title" json:"title"`
	MP3URL   string `bson:"mp3_url" json:"mp3_url"`
	Duration string `bson:"duration" json:"duration"`
}

type Book struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Author      string             `bson:"author" json:"author"`
	Language    string             `bson:"language" json:"language"`
	Category    string             `bson:"category" json:"category"`
	URLRss      string             `bson:"url_rss" json:"url_rss"`
	URLLibriVox string             `bson:"url_librivox" json:"url_librivox"`
	TotalTime   string             `bson:"totaltime" json:"totaltime"`
	CoverURL    *string            `bson:"cover_url,omitempty" json:"cover_url,omitempty"`
	Chapters    []Chapter          `bson:"chapters" json:"chapters"`
}

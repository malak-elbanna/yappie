package config

import (
	"io"
	"os"
	"path/filepath"

	"github.com/sirupsen/logrus"
)

var Logger *logrus.Logger

func InitLogger() {
	Logger = logrus.New()

	logDir := "/var/log/streaming-service"
	logFile := filepath.Join(logDir, "app.log")

	if _, err := os.Stat(logDir); os.IsNotExist(err) {
		err := os.MkdirAll(logDir, os.ModePerm)
		if err != nil {
			Logger.Fatal("Failed to create log directory:", err)
		}
	}

	file, err := os.OpenFile(logFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		Logger.Fatal("Failed to open log file:", err)
	}

	Logger.SetFormatter(&logrus.JSONFormatter{})
	Logger.SetOutput(io.MultiWriter(os.Stdout, file))
	Logger.SetLevel(logrus.InfoLevel)
}

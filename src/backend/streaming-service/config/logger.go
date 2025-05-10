package config

import (
	"github.com/sirupsen/logrus"
	"github.com/yukitsune/lokirus"
)

var Logger *logrus.Logger

func InitLogger() {
	Logger = logrus.New()

	opts := lokirus.NewLokiHookOptions().
		WithFormatter(&logrus.JSONFormatter{}).
		WithStaticLabels(lokirus.Labels{
			"job":     "streaming-service",
			"service": "streaming",
		})

	hook := lokirus.NewLokiHookWithOpts(
		"http://loki:3100",
		opts,
		logrus.InfoLevel,
		logrus.WarnLevel,
		logrus.ErrorLevel,
		logrus.FatalLevel,
	)

	Logger.AddHook(hook)
	Logger.SetFormatter(&logrus.JSONFormatter{})
	Logger.SetLevel(logrus.InfoLevel)
}

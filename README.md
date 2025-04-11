# yappie
docker-compose up --build

docker-compose exec user-service rm -rf migrations (only if there already exists a migrations folder in the container)

docker-compose exec user-service flask db init

docker-compose exec user-service flask db migrate -m "Initial migration"

docker-compose exec user-service flask db upgrade

docker-compose exec user-service python admin_setup.py

docker-compose run --rm kong kong migrations up

curl -i -X POST http://localhost:8001/services/ \
  --data name=user-service \
  --data url=http://user-service:5000

curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data name=user-service-route \
  --data paths[]=/user-service

curl -i http://localhost:8000/user-service/health

curl -i -X POST http://localhost:8001/services \
  --data name=cms-service \
  --data url=http://cms-service:5001

curl -i -X POST http://localhost:8001/services/cms-service/routes \
  --data name=cms-service-route \
  --data paths[]=/admin-cms

curl -i http://localhost:8000/admin-cms/health

curl http://5001/audiobooks

curl -i -X POST http://localhost:8001/services/ \
  --data name=streaming-service \
  --data url=http://streaming-service:8080

curl -i -X POST http://localhost:8001/services/streaming-service/routes \
  --data name=streaming-service-route \
  --data paths[]=/streaming-service
# yappie
docker-compose up --build
docker-compose exec user-service rm -rf migrations (only if there already exists a migrations folder in the container)
docker-compose exec user-service flask db init
docker-compose exec user-service flask db migrate -m "Initial migration"
docker-compose exec user-service flask db upgrade

docker-compose run --rm kong kong migrations up

curl -i -X POST http://localhost:8001/services/ \
  --data name=user-service \
  --data url=http://user-service:5000

curl -i -X POST http://localhost:8001/services/user-service/routes \
  --data name=user-service-route \
  --data paths[]=/user-service

curl -i http://localhost:8000/user-service/health
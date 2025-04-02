# yappie
docker-compose up --build
docker-compose exec user-service rm -rf migrations (only if there already exists a migrations folder in the container)
docker-compose exec user-service flask db init
docker-compose exec user-service flask db migrate -m "Initial migration"
docker-compose exec user-service flask db upgrade
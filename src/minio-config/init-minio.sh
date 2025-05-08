#!/bin/sh

# Continuously try to set the alias until successful
until mc alias set local http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD} >/dev/null 2>&1; do
  echo "Waiting for MinIO to be ready..."
  sleep 1
done

# Create bucket if it doesn't exist
mc mb local/audiobooks --ignore-existing

# cat > policy.json <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": "*",
#       "Action": [
#         "s3:GetObject"
#       ],
#       "Resource": [
#         "arn:aws:s3:::audiobooks/*"
#       ]
#     }
#   ]
# }
# EOF

mc anonymous set download local/audiobooks

echo "MinIO initialization complete"

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .                      
RUN chmod +x entrypoint.sh 

EXPOSE 5002

ENV PYTHONPATH=/app

ENTRYPOINT ["./entrypoint.sh"]
CMD ["python", "run.py"]

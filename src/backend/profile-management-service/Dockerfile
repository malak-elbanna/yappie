FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN chmod +x entrypoint.sh

EXPOSE 5002

ENTRYPOINT ["./entrypoint.sh"]
CMD ["python", "run.py"]

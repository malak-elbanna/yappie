FROM python:3.11

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .                      
RUN chmod +x entrypoint.sh   

EXPOSE 5000

ENV PYTHONPATH=/app
ENV FLASK_APP=app.py

ENTRYPOINT ["./entrypoint.sh"]
CMD ["flask", "run", "--host=0.0.0.0"]

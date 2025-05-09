import pika
import sys
import atexit
import signal

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='rabbitmq',port = 5672,heartbeat=0))
channel = connection.channel()

channel.exchange_declare(exchange='jobs', exchange_type='topic',durable=True)

def clean_close():
    if channel:
        channel.close()
    if connection:
        connection.close()

atexit.register(clean_close)
signal.signal(signal.SIGINT, clean_close)
signal.signal(signal.SIGTERM, clean_close)
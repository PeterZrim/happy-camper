"""
Gunicorn configuration file for Happy Camper project.
"""

import multiprocessing
import os

# Server socket
bind = os.getenv('GUNICORN_BIND', '0.0.0.0:8000')
backlog = 2048

# Worker processes
workers = os.getenv('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1)
worker_class = 'gevent'
worker_connections = 1000
timeout = 30
keepalive = 2

# Process naming
proc_name = 'happy_camper'

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# SSL
keyfile = os.getenv('SSL_KEYFILE', None)
certfile = os.getenv('SSL_CERTFILE', None)

# Security
limit_request_line = 4096
limit_request_fields = 100
limit_request_field_size = 8190

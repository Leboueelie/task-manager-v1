FROM python:3.12-slim

WORKDIR /app

# Installation des dépendances
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code backend
COPY backend/ .

# Exposition du port
EXPOSE 8000

# Commande de démarrage
CMD python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
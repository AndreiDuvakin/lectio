FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY req.txt .

RUN pip install --no-cache-dir -r req.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host=0.0.0.0", "--port=8000"]

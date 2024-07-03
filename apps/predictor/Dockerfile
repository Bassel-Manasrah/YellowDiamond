FROM python:slim-bullseye

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY setup_nltk.py .

RUN python setup_nltk.py

COPY . .

CMD [ "flask", "--app", "./index.py", "run", "--host=0.0.0.0", "--port=$PORT"]
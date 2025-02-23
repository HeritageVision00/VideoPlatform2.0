FROM  mhmasum6875/vsmaidul
# FROM graymaticsinc/vs:0.0.6
# FROM python:3.8-slim
WORKDIR /usr/src/app
COPY . .

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgl1-mesa-glx \
    ffmpeg \
    pkg-config && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r requirements.txt
RUN rm requirements.txt
EXPOSE 3330

CMD [ "python3", "main.py" ]
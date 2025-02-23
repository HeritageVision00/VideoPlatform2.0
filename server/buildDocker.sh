docker build --platform linux/amd64 -t graymaticsinc/multi-tenant-server_amd64:$1 .
docker push graymaticsinc/multi-tenant-server_amd64:$1
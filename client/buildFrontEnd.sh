# ng build --optimization=true --aot=true --build-optimizer=true --configuration=production

sudo docker build --no-cache -t graymatics1/multi-tenant-ui_amd64 --target compiler . && sudo docker push graymatics1/multi-tenant-ui_amd64
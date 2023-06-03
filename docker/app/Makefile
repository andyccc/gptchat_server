prj_name = gptchat_server
docker_image = ${prj_name}
docker_data = /opt/docker/${prj_name}

local_app_dir = ${docker_data}/app
docker_app_dir = /app

local_service_port = 9527
docker_service_port = 9527

docker_attach = -p $(local_service_port):$(docker_service_port) \
-v $(local_app_dir):$(docker_app_dir) \
--net docker_app_network \
--net-alias ${prj_name} \
--link mysql:mysql 


image:
	docker build -t $(docker_image) .

try:
	echo $(docker_attach)

debug:
	docker run --rm --name $(prj_name) $(docker_attach) -it $(docker_image) bash

stop:
	docker stop $(prj_name)

run:
	docker run --rm --name $(prj_name) -dit $(docker_attach) -it $(docker_image)

deploy: image run


# docker container quite https://www.cnblogs.com/waterlufei/p/6994338.html

docker network create app_network
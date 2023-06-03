
# Configuration .env file
copy .env.example to .env

# install docker

# build docker image
docker build -t gptchat_server .

# run docker image
# node=dev/uat/prod, default is dev
docker run -p 9527:9527 -e node=uat  gptchat_server





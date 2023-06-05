#!/bin/bash

sudo make stop
sudo make image
sudo make run

# 检查是否存在无标签 (dangling) 镜像
if [[ $(sudo docker images -f dangling=true -q) ]]; then
    # 存在无标签 (dangling) 镜像，进行删除操作
    sudo docker rmi $(docker images -f dangling=true -q)
    echo "已删除所有无标签镜像"
else
    # 不存在无标签 (dangling) 镜像
    echo "没有发现无标签镜像"
fi

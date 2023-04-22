# This file is used to pull the docker image and create a continer from it.

# importing the necessary dependencies
import docker
import os

# Create a Docker client
docker_client = docker.from_env()

# Pull the MongoDB image
mongo_image = docker_client.images.pull('mongo')

with open("value.txt","r") as f:
    container_name = f.read()

# container_name = 'my-mongo-container'

# Create a container from the MongoDB image
mongo_container = docker_client.containers.run(
    image='mongo',
    name=container_name,
    ports={'27017/tcp': 27017},
    detach=True
)

# Print the container ID
print(f"Container ID: {mongo_container.id}")

# export a variable to the environment

os.environ["container_name"] = container_name
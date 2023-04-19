import docker

# Create a Docker client
docker_client = docker.from_env()

# Pull the MongoDB image
mongo_image = docker_client.images.pull('mongo')

# Create a container from the MongoDB image
mongo_container = docker_client.containers.run(
    image='mongo',
    name='my-mongo-container',
    ports={'27017/tcp': 27017},
    detach=True
)

# Print the container ID
print(f"Container ID: {mongo_container.id}")

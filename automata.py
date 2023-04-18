import docker

# Initialize the Docker client
client = docker.from_env()

# Define the container name and image
container_name = 'mongodb'
image_name = 'mongo:latest'


# Check if the Docker image exists
try:
    client.images.get(image_name)
except docker.errors.ImageNotFound:
    # If the image does not exist, pull it from the Docker Hub
    print(f"Image {image_name} not found. Pulling from Docker Hub...")
    client.images.pull(image_name)

# Check if the container already exists
try:
    container = client.containers.get(container_name)
except docker.errors.NotFound:
    container = None

# If the container does not exist, create it
if not container:
    container = client.containers.run(image_name, detach=True, name=container_name)
    print(f"Created container {container_name}")

# If the container exists, start it if it is not running
elif container.status != 'running':
    container.start()
    print(f"Started container {container_name}")

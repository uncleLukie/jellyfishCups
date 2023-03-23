# Use an official Python runtime as a parent image
FROM python:3.11.2

# Set the working directory
WORKDIR /app

# Copy the requirements.txt and install dependencies
COPY requirements.txt /app/
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Copy the app folder into the container
COPY app /app/
COPY run.py /app/
COPY db_init.py /app/

# Make port 5000 available to the world outside the container
EXPOSE 5000

CMD ["python", "run.py"]

# Use the official Node.js LTS image as the base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the remaining application files
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to cache dependencies
COPY package*.json ./

# Set npm configuration
RUN npm install -g npm@latest
RUN npm set registry="https://registry.npmjs.org/"
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 600000
RUN npm config set fetch-retry-maxtimeout 1200000
RUN npm config set fetch-timeout 1800000

# Install dependencies
RUN npm install -D @swc/cli @swc/core
RUN npm install --loglevel verbose

# Copy the frontend source code to the container
COPY . .

# Expose the port your frontend app will run on
EXPOSE 3000

# Define the command to start your frontend app
RUN npm run build
CMD ["npm", "run", "start","--","-p","21033"]
# Use the official Golang image as the base image
FROM golang:latest

# Set the working directory in the container
WORKDIR /app

# Copy go.mod and go.sum to cache package dependencies
COPY go.mod go.sum ./

# Download and install dependencies
RUN go mod download

# Copy the backend source code to the container
COPY . .

# Build your Golang application
RUN go build

# Expose the port your Golang app will listen on
EXPOSE 21032

# Define the command to start your Golang application
CMD ["./finance-management"]
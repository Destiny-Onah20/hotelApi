# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container's working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files to the container's working directory
COPY . .

# Build the TypeScript code inside the container
RUN npm run build

# Expose the port your Node.js application listens on (change 3000 to the port used in your Node.js app)
EXPOSE 1100

# Command to start your compiled Node.js application (change 'dist/server.js' to the compiled entry point file of your Node.js app)
CMD ["node", "dist/server.js"]

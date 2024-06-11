# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which your application will run (replace 8080 with your desired port)
EXPOSE 8080

# Specify the command to run your application
CMD ["npm", "start"]

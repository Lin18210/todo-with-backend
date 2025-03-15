# Use an official node.js runtime as a parent image
FROM node:22-alpine

# Set the workin directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.josn files to the container
COPY package*.json .

#Install the dependencies
RUN npm install

#Copy the rest of the app code
COPY . .

#Expose the port that the app runs on
EXPOSE 2222

#Define the command the run your app
CMD ["node", "./src/server.js"]
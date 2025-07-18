# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

# ✅ Fix for bcrypt/native issues
RUN npm install --legacy-peer-deps

# Copy app files
COPY . .
 
# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]

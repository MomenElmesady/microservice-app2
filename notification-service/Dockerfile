# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

# ✅ Fix for bcrypt/native issues
RUN npm install --legacy-peer-deps

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh
# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["./wait-for-it.sh", "rabbitmq:5672", "--timeout=60", "--strict", "--", "node", "app.js"]

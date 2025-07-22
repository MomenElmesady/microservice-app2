# Use official Node.js base image
FROM node:18

# تثبيت nodemon بشكل عالمي
RUN npm install -g nodemon

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# نسخ سكربت الانتظار
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start with nodemon after RabbitMQ is ready
CMD ["./wait-for-it.sh", "rabbitmq:5672", "--timeout=60", "--strict", "--", "nodemon", "app.js"]

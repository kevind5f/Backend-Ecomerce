FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

# Copy source
COPY . .

# Expose port (optional, Render sets PORT env)
EXPOSE 10000

# Start the app
CMD [ "node", "src/server.js" ]

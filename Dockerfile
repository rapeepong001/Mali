# Use official Node.js LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (use npm install to avoid npm ci lockfile issues on some build environments)
COPY package*.json ./
RUN npm install --production --no-audit --no-fund

# Copy app source
COPY . .

# Expose port and start
EXPOSE 3000
CMD ["node", "index.js"]

# Production Node.js Image for PT Panca Lingga Perkasa Backend & CMS
FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies (including production packages)
RUN npm install --production

# Copy all project files & assets
COPY . .

# Environment variables
ENV PORT=80
ENV NODE_ENV=production

# Expose HTTP port
EXPOSE 80

# Start server
CMD ["node", "server.js"]

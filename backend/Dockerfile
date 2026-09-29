FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Use npm ci for clean, reproducible production installs
RUN npm ci --omit=dev

# Install mysql-client for database exports
RUN apk add --no-cache mysql-client

COPY . .

ENV NODE_ENV=production

# Expose API port
EXPOSE 5000

CMD ["node", "server.js"]

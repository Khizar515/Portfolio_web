FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# We will install dependencies during development, but for prod use ci
RUN npm install

# Install mysql-client for database exports
RUN apk add --no-cache mysql-client

COPY . .

# Expose API port
EXPOSE 5000

CMD ["npm", "start"]

# Backend Dockerfile
FROM node:18-alpine

# Install Python and build tools for bcrypt compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
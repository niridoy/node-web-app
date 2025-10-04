FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

EXPOSE 8080
CMD ["node", "app.js"]

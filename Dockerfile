FROM node:18
WORKDIR /Task-Management
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]

FROM node:18

# Optional tools for debugging inside the container (like nano)
RUN apt-get update && apt-get install -y nano

# Create app directory
WORKDIR /app

# Copy dependencies definition files
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose port Next.js runs on
EXPOSE 3000

RUN npm run build
# Run the dev server
CMD ["npm", "start"]

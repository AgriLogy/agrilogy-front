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

# Build the Next.js app
RUN npm run build

# Expose port Next.js runs on
EXPOSE 3000

# Start the production server (after the build)
CMD ["npm", "run", "dev"]

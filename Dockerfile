FROM node:18

# Create app directory
WORKDIR /app

COPY env-example /.env

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
CMD ["npm", "run", "start"]

FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 5173

# Set environment variables
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5173

# Start the app
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 5173 --strictPort"]

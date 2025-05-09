FROM node:24-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install


EXPOSE 4000

CMD ["npm", "run", "dev"]

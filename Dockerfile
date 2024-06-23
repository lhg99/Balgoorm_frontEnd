# Build stage
FROM node:16
WORKDIR /usr/src/app
RUN npm i
COPY ./ ./
EXPOSE 3000
CMD ["serve", "build"]

# Use an official Node runtime as a parent image
FROM node:14.15.5-alpine3.10

RUN apk --no-cache add git

# Set the working directory to /app
WORKDIR '/app'
ENV NODE_ENV=production

RUN rm -rf packages/api/client

# Copying the rest of the code to the working directory
COPY . .

RUN yarn bootstrap

# Make port 3200 available to the world outside this container
EXPOSE 3200

# Run index.js when the container launches
#CMD ["node", "packages/api/src/app.js"]
CMD ["yarn", "start:api"]

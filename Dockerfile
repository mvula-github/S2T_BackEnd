#
FROM node:20

#Working Dir
WORKDIR /usr/src/app

#Copy Package Json FIle
COPY package*.json ./

# Install app dependencies
RUN npm install --production

#Copy Source Files
COPY . .

# Expose the application port
EXPOSE 5000

CMD ["node","index.js"]
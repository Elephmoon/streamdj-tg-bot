FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN npm install yarn
RUN yarn install --production

COPY . .

CMD ["node", "index.js"]
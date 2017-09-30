from node:6.9.0

EXPOSE 3000
WORKDIR /usr/src/app

RUN npm install -g bower

COPY package.json /usr/src/app
RUN npm install

COPY bower.json /usr/src/app
COPY .bowerrc /usr/src/app
RUN bower --allow-root install

COPY . /usr/src/app
COPY server/datasources.production.json /usr/src/app/server/datasources.json

CMD npm start


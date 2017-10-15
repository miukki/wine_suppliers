## Descriprtion
Wine scanner

## Install for dev env
`npm install`
`npm install -g supervisor`
`npm install -g strongloop`
`npm install -g grunt-cli`

## Server run
### Start server
`node .`
### for backend dev, start server with supervisor
`supervisor server/server.js`


##DBs (we have connectors: mongo only now )
`sudo mongod`

## Client
This is the place for your application front-end files.

###lb-services
`lb-ng server/server.js client/js/services/lb-services.js`

### to generate angular SDK from loopback
#### start local server with documentation with lb-ng doc
`grunt angular-sdk`

## Docker

### Running in the Docker Compose

```bash
docker-comopse build
docker-compose up -d #Detached mode: Run containers in the background
```

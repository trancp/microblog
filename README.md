# microblog

using DOCKER

1)requires mongo and node
pull those images from docker hub

2)download repository

3)cd into repository

4)to create docker image of repository
docker build -t <create name for new image> . 

5)run a mongodb container
docker run --name <create name for DB container> -d mongo

6)creating container for app running node and linking it to a db, then entering bash for the app container
docker run -i -t --name <create name for app container> --link <name of DB>:db_1 -p 80:3000 <name of image>:latest bash 

7)in bash run following command and should return app running on port 3000
node server.jr

8)open web browser and go to ip address given when you opened docker terminal

using IDE

1) download repository, must have node, npm, and mongodb installed

2) open respository in IDE

3) go into microblog/config and edit database.js
url: 'mongodb://db_1:27017/test' to url: 'mongodb://localhost:27017/test'

4) download packages of repository
npm install

5) run mongoDB in terminal
mongod

6) run app, should return app running on port 3000
node server.js

7) open browser to localhost:3000




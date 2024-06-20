FROM node:20.14 as build

    RUN mkdir -p /home/ubuntu/node/app/node_modules && chown -R node:node /home/ubuntu/node/app

WORKDIR /home/ubuntu/node/app
ENV PATH /home/ubuntu/node/app/node_modules/.bin:$PATH

        COPY package.json /home/ubuntu/node/app/package.json
        COPY server.mjs /home/ubuntu/node/app/server.mjs
        COPY iniciar.sh /home/ubuntu/node/app/iniciar.sh

    RUN chmod +x /home/ubuntu/node/app/iniciar.sh
    RUN npm install

        COPY . /home/ubuntu/node/app
        COPY --chown=node:node . .


EXPOSE 9080
EXPOSE 3000

    RUN npm install http-server
    RUN apt update
    RUN apt -y install ufw
    RUN ufw allow 9080
    RUN ufw allow 3000


USER node
    RUN chmod +x /home/ubuntu/node/app/iniciar.sh

CMD ["http-server","-s","-o","/home/ubuntu/node/app","-p","9080"]
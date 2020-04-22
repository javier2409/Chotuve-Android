FROM bycedric/expo-cli
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json app.json ./
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19003
EXPOSE 19004
EXPOSE 19005
EXPOSE 19006
CMD npm install && expo start

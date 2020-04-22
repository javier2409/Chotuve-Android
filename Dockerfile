FROM bycedric/expo-cli
WORKDIR /usr/src/app
COPY package.json app.json ./
RUN yarn --network-timeout 100000
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
CMD expo start

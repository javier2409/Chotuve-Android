Requisitos para el desarrollo
=============================
- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

# Instrucciones

1. Crearse una cuenta en [Expo](https://expo.io/).
2. Crear un archivo `credentials.env` en la raíz del proyecto con el siguiente contenido:

```
EXPO_CLI_USERNAME=user
EXPO_CLI_PASSWORD=pass
```
Reemplazar `user` y `pass` por las credenciales de tu cuenta Expo.

3. Lanzar el contenedor desde una terminal ubicada en la raíz del proyecto:

```console
$ docker-compose up
```

4. Descargar la aplicación de Expo para Android, ingresar con tu cuenta, buscar el proyecto `Chotuve` y conectarse para tener las actualizaciones en vivo.
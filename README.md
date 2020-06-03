[![Build Status](https://travis-ci.com/javier2409/Chotuve-Android.svg?token=6UKn2UCvxXefMef1FKs7&branch=master)](https://travis-ci.com/javier2409/Chotuve-Android)

Probar la App
=============

1. Ingresar a la aplicación Expo.
2. Escanear el código QR del proyecto:

[Staging](https://expo.io/@javier2409/Chotuve?release-channel=staging)
[Producción](https://expo.io/@javier2409/Chotuve?release-channel=prod)

Trello
========

Roadmap en Trello: [Link](https://trello.com/invite/b/8W86DsUl/ab98b2135c832c132ce42357f1546798/chotuve-android)

Requisitos para el desarrollo
=============================
- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instrucciones para el desarrollo

A continuacion se detallan los pasos necesarios para lanzar el servidor de Expo, con el cual podemos ver los cambios en la aplicación en tiempo real en nuestro celular, a través de la app de Expo.

1. Crearse una cuenta en [Expo](https://expo.io/).
2. Crear un archivo `credentials.env` en la raíz del proyecto con el siguiente contenido:

```
EXPO_CLI_USERNAME=user
EXPO_CLI_PASSWORD=pass
```
Reemplazar `user` y `pass` por las credenciales de tu cuenta Expo.

3. Lanzar el contenedor desde una terminal ubicada en la raíz del proyecto:

```console
$ docker-compose run expo
```

4. En la terminal del contenedor, correr el servidor de Expo con el comando:

```console
$ expo start
```

### Para conectarse al servidor de cambios en vivo:

1. Ingresar en la app de Expo con tu cuenta.
2. Seleccionar la aplicacion `Chotuve` en la lista.

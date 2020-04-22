Instrucciones para desarrollo
=============================

1. Crearse una cuenta en [Expo](https://expo.io/).
2. Crear el archivo `docker-compose.yml` en la raíz del proyecto con el siguiente contenido.

```yaml
version: '3.7' 

services:
   expo: 
      container_name: expo-container
      build: ./ 
      ports:
         - 19000-19006:19000-19006
      volumes: 
         - ./:/usr/src/app
      environment: 
         - REACT_NATIVE_PACKAGER_HOSTNAME=X.X.X.X
         - EXPO_CLI_USERNAME=user
         - EXPO_CLI_PASSWORD=pass

```

3. Reemplazar `X.X.X.X` por tu IP local (ejemplo: 192.168.0.7), `user` y `pass` por las credenciales de tu cuenta expo.
4. Lanzar el contenedor.

```bash
docker-compose up
```

5. Desde la aplicacion de Expo para Android ingresar con la cuenta, buscar el proyecto `Chotuve` y conectarse para tener las actualizaciones en vivo.
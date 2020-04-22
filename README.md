Instrucciones para desarrollo
=============================

1. Buildear la imagen
```bash
docker build --tag expo-chotuve-dependencies .
```

2. Correr el contenedor
```bash
docker run \
    --tty \
    --interactive \
    --volume ${pwd}:/usr/src/app \
    --env EXPO_CLI_USERNAME=user \
    --env EXPO_CLI_PASSWORD=password \
    --env REACT_NATIVE_PACKAGER_HOSTNAME="192.168.0.16" \
    --expose 19000-19002:19000-19002 \
    --name chotuve-dev \
    expo-chotuve-dependencies
```
NOTA: Reemplazar `user` y `password` por tus credenciales de expo.

3. Ingresar en la app `expo` desde android con tu cuenta.
4. En la lista de proyectos entrar en `Chotuve` para visualizar en vivo los cambios en la app.
5. Siempre que se agregan dependencias en `package.json` hay que rebuildear la imagen con el comando del paso 1.
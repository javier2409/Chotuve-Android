import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Divider, Icon, Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native';
import { Video } from 'expo-av';

export default function Upload() {
  const {colors} = useTheme();
  const [filename, setFilename] = useState("Ningún archivo seleccionado");

  let pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
      if (!result.cancelled) {
        setFilename(result.uri);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
  return (
      <View style={{...styles.container, ...{backgroundColor: colors.lighterbackground}}}>
        <View style={styles.block}>
          <Icon name='attach-file' containerStyle={styles.icon} color={colors.primary} size={40} onPress={pickImage} reverse />
          <Text style={{...styles.filename, ...{color: colors.text}}}>{filename}</Text>
        </View>
        <Divider/>
        <View style={styles.block}>
          <Text style={{...styles.title, ...{color: colors.title}}}>Título</Text>
          <Input inputStyle={{...styles.titleinput, ...{color: colors.text}}} selectionColor={colors.text}/>
        </View>
        <Divider/>
        <View style={styles.block}>
          <Text style={{...styles.description, ...{color: colors.title}}}>Descripción</Text>
          <Input inputStyle={{...styles.descinput, ...{color: colors.text}}} multiline/>
        </View>
        <View style={styles.buttonview}>
          <Button title='SUBIR VIDEO' color={colors.primary} style={styles.button} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 10
  },
  block: {
    padding: 20,
  },
  buttonview: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ffffff'
  },
  filename: {
    alignSelf: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  },
  description: {
    fontWeight: 'bold',
    fontSize: 20
  },
  icon: {
    alignSelf: 'center'
  }
});

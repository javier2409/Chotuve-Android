import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
          <Text style={{...styles.title, ...{color: colors.text}}}>Título</Text>
          <Input inputStyle={{...styles.titleinput, ...{color: colors.text}}} selectionColor={colors.text}/>
        </View>
        <Divider/>
        <View style={styles.block}>
          <Text style={{...styles.description, ...{color: colors.text}}}>Descripción</Text>
          <Input inputStyle={{...styles.descinput, ...{color: colors.text}}} multiline/>
        </View>
        <View style={styles.buttonview}>
          <TouchableOpacity style={{...styles.publishbtn, ...{backgroundColor: colors.primary}}}>
            <Icon size={30} name='publish' color={colors.text}/>
            <Text style={{...styles.uploadtext, ...{color: colors.text}}}>Publicar video</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10
  },
  block: {
    padding: 20,
  },
  buttonview: {
    alignItems: 'center',
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
  },
  uploadtext: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  publishbtn: {
    margin: 30,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

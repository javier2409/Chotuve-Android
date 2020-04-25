import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';

const data = [
];

for (let i = 0; i<20; i++){
  data.push({key: i.toString()});
}


function VideoItem() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{...styles.videoitem, ...{backgroundColor: colors.lighterbackground}}} onPress={() => {
      navigation.navigate("Video");
    }}>
      <Text style={{color: colors.text, fontSize: 30}}>Soy un video</Text>
    </TouchableOpacity>
  );
}

export default function Home({navigation}) {
  const {colors} = useTheme();
  
  return (
    <View style={styles.container}>
      <FlatList
        refreshing={false}
        style={{...styles.flatlist, ...{backgroundColor: colors.background}}}
        data={data}
        renderItem={({item}) => {
          return <VideoItem colors={colors}/>
        }}
        onRefresh={() => {

        }}        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoitem: {
    margin: 5,
    padding: 10,
    borderRadius: 5
  },
  flatlist: {
    backgroundColor: '#242424'
  }
});

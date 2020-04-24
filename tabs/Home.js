import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';

const data = [
];

for (let i = 0; i<20; i++){
  data.push({key: i.toString()});
}


function VideoItem(props) {
  const {colors} = useTheme();

  return (
    <View style={{...styles.videoitem, ...{backgroundColor: colors.lighterbackground}}}>
      <Text style={{color: colors.text, fontSize: 30}}>Soy un video</Text>
    </View>
  );
}

export default function Home() {
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

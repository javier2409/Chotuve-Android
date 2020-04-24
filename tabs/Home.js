import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ScrollView } from 'react-native';

const data = [
];

for (let i = 0; i<20; i++){
  data.push({});
}


function VideoItem({props}) {
  return (
    <View style={styles.videoitem}>
      <Text style={{color: 'white', fontSize: 30}}>Soy un video</Text>
    </View>
  );
}

export default function Home() {
  return (
    <View style={styles.container}>
      <FlatList
        refreshing={false}
        style={styles.flatlist}
        data={data}
        renderItem={({item}) => {
          return <VideoItem />
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
    backgroundColor: '#343434',
    margin: 5,
    padding: 10,
    borderRadius: 5
  },
  flatlist: {
    backgroundColor: '#242424'
  }
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useEffect, useState} from 'react';
import {Accelerometer} from 'expo-sensors';

export default function App() {
  const [leitura, setLeitura] = useState({
    x: 0,
    y: 0,
    z: 0
  });

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);
    const inscricao = Accelerometer.addListener(setLeitura);

    return inscricao.remove();

  }, [])

  return (
    <View style={styles.container}>
      <Text>Macumba Saravá</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

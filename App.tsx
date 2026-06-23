import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {useEffect, useState, useRef} from 'react';
import {Accelerometer} from 'expo-sensors';

export default function App() {
  const [leitura, setLeitura] = useState({
    x: 0,
    y: 0,
    z: 0
  });
  const [ligado, setLigado] = useState(false);
  const subscription = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (subscription.current) {
        subscription.current.remove();
        subscription.current = null;
      }
    };
  }, []);

  const start = () => {
    if (subscription.current) return;
    Accelerometer.setUpdateInterval(100);
    subscription.current = Accelerometer.addListener(result => {
      setLeitura(result);
    });
    setLigado(true);
  };

  const stop = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
    setLigado(false);
  };

  const { x, y, z } = leitura;
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  const absX = Math.abs(x);
  const absY = Math.abs(y);
  const absZ = Math.abs(z);
  let dominant: 'x' | 'y' | 'z' = 'x';
  if (absY >= absX && absY >= absZ) dominant = 'y';
  else if (absZ >= absX && absZ >= absY) dominant = 'z';
  const sign = (val: number) => (val >= 0 ? '+' : '-');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acelerômetro</Text>
      <Text style={styles.value}>Velocidade: {magnitude.toFixed(2)}</Text>
      <Text style={styles.status}>Status: {ligado ? 'Ligado' : 'Desligado'}</Text>

      <View style={styles.axesContainer}>
        <Text style={[styles.axis, dominant === 'x' && styles.axisActive]}>X: {x.toFixed(2)}</Text>
        <Text style={[styles.axis, dominant === 'y' && styles.axisActive]}>Y: {y.toFixed(2)}</Text>
        <Text style={[styles.axis, dominant === 'z' && styles.axisActive]}>Z: {z.toFixed(2)}</Text>
      </View>

      <Text style={styles.direction}>Eixo dominante: {dominant.toUpperCase()}{dominant === 'x' ? sign(x) : dominant === 'y' ? sign(y) : sign(z)}</Text>

      <View style={{ marginTop: 12 }}>
        <Button
          title={ligado ? 'Desligar' : 'Ligar'}
          onPress={() => (ligado ? stop() : start())}
        />
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    marginTop: 6,
  },
  status: {
    fontSize: 14,
    marginTop: 6,
    color: '#666'
  }
  ,axesContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  axis: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  axisActive: {
    color: '#0a84ff',
    fontWeight: '700'
  },
  direction: {
    marginTop: 8,
    fontSize: 15,
    color: '#444'
  }
});

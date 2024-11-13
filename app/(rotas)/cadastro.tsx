import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { Image } from 'expo-image';
import { styles as stilus } from './Styles';
export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
        <Image source={require('../../assets/images/salve-food.png')} style={stilus.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

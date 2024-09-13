import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../components/Navigation/StackNavigator';
import Video from 'react-native-video';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const Splash = ({navigation}: SplashProps) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('BottomTabNaviGator');
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/Splash.mp4')}
        resizeMode="cover"
        style={styles.video}
        muted={true}
        repeat={true}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Splash;

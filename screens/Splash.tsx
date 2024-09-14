import {View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../components/Navigation/StackNavigator';
import Video from 'react-native-video';
import {useDatabase} from '../hooks/useDataBase';
import {createTable} from '../database/dbServices';

type SplashProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const Splash = ({navigation}: SplashProps) => {
  const {db, loading} = useDatabase();
  const handleTableCreation = async () => {
    if (db) {
      try {
        await createTable(db);
        console.log('Table created successfully');
      } catch (err) {
        console.error('Failed to create table:', err);
      }
    }
  };
  useEffect(() => {
    if (!loading) {
      handleTableCreation();
      setTimeout(() => {
        navigation.navigate('BottomTabNaviGator');
      }, 3000);
    }
  }, [db, loading, navigation]);

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

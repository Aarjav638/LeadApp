import {StyleSheet, useColorScheme} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../components/Navigation/StackNavigator';
import LeadEditForm from '../components/lead/LeadEditModal';

export type LeadEditFormProps = NativeStackScreenProps<
  RootStackParamList,
  'Edit'
>;

const EditLead = ({navigation, route}: LeadEditFormProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? 'black' : '#f4f4f4',
      }}>
      <LeadEditForm navigation={navigation} route={route} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default EditLead;

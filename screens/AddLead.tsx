import {View, StyleSheet, useColorScheme} from 'react-native';
import React from 'react';
import LeadForm from '../components/lead/LeadForm';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabParamList} from '../components/Navigation/BottomTabNavigation';

export type AddLeadProps = NativeStackScreenProps<BottomTabParamList, 'Add'>;

const AddLead = ({navigation, route}: AddLeadProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode ? 'black' : '#f4f4f4',
      }}>
      <LeadForm navigation={navigation} route={route} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default AddLead;

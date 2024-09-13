import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import BottomTabNavigator, {BottomTabParamList} from './BottomTabNavigation';
import Splash from '../../screens/Splash';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import {StatusBar, useColorScheme} from 'react-native';
import {LeadType} from '../../database/typing';
import EditLead from '../../screens/EditLeads';

export type RootStackParamList = {
  Splash: undefined;
  Edit: {
    lead: LeadType;
  };
  BottomTabNaviGator: BottomTabParamList | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <NavigationContainer>
      <PaperProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent={true}
        />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 500,
          }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Group>
            <Stack.Screen
              name="BottomTabNaviGator"
              component={BottomTabNavigator}
            />
            <Stack.Screen name="Edit" component={EditLead} />
          </Stack.Group>
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default StackNavigator;

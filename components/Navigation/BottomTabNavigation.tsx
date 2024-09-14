import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddLead from '../../screens/AddLead';
import Home from '../../screens/Home';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Alert, StatusBar} from 'react-native';
import {handleDownload} from '../../utils/helper';
import {useDatabase} from '../../hooks/useDataBase';

export type BottomTabParamList = {
  Home: undefined;
  Add: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const {db} = useDatabase();
  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <Tab.Navigator
        backBehavior="order"
        screenOptions={{
          tabBarActiveBackgroundColor: 'aqua',
          tabBarStyle: {
            backgroundColor: 'lightgray',
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            title: 'All Leads',
            tabBarLabel: 'Leads',
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => (
              <Icon
                name="download"
                size={20}
                color="blue"
                style={{marginRight: '10%'}}
                onPress={
                  db
                    ? () => {
                        try {
                          handleDownload(db);
                        } catch (error) {
                          console.error('Failed to download:', error);
                        }
                      }
                    : () => Alert.alert('Database not found')
                }
              />
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({focused}) => (
              <Icon name="list" size={20} color={focused ? 'blue' : 'black'} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddLead}
          options={{
            title: 'Add Lead',
            tabBarLabel: 'Add',
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({focused}) => (
              <Icon name="plus" size={20} color={focused ? 'blue' : 'black'} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

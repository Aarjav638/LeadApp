import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddLead from '../../screens/AddLead';
import Home from '../../screens/Home';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {getPrinters, handleDownload, handlePrint} from '../../utils/helper';
import {useDatabase} from '../../hooks/useDataBase';
import {Menu, Icon as Icons} from 'react-native-paper';
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
export type BottomTabParamList = {
  Home: undefined;
  Add: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const {db} = useDatabase();
  const isDarkMode = useColorScheme() === 'dark';
  const [printers, setPrinters] = React.useState<any[]>([]);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const fetchPrinters = async () => {
    const printer = await getPrinters();
    setPrinters(printer);
  };
  useEffect(() => {
    fetchPrinters();
  }, []);
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
              <View style={styles.container}>
                <Menu
                  anchorPosition="bottom"
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Text
                      onPress={() => setMenuVisible(true)}
                      style={{
                        ...styles.leadText,
                        color: isDarkMode ? 'black' : '#f4f4f4',
                      }}>
                      <Icons source={'printer'} size={25} color="green" />
                    </Text>
                  }>
                  {printers.map(printer => (
                    <Menu.Item
                      key={printer.id}
                      onPress={() => {
                        handlePrint(printer.id);
                        setMenuVisible(false);
                      }}
                      title={printer.name}
                    />
                  ))}
                </Menu>
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
              </View>
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
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '38%',
    paddingHorizontal: 10,
  },
  leadText: {
    fontSize: 16,
    fontWeight: 'semibold',
  },
});

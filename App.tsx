import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import BottomTabNavigator from './components/Navigation/BottomTabNavigation';
import {useDatabase} from './hooks/useDataBase';
import {createTable} from './database/dbServices';
import StackNavigator from './components/Navigation/StackNavigator';

const App = () => {
  const {db} = useDatabase();

  const handleTableCreation = async () => {
    if (db) {
      try {
        await createTable(db);
      } catch (err) {
        console.error('Failed to create table:', err);
      }
    }
  };

  useEffect(() => {
    handleTableCreation();
  }, []);

  return <StackNavigator />;
};

export default App;

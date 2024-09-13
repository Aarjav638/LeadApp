import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  BackHandler,
  useColorScheme,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabParamList} from '../components/Navigation/BottomTabNavigation';
import {LeadType} from '../database/typing';
import {useDatabase} from '../hooks/useDataBase';
import {deleteLeadItem, getLeadItems} from '../database/dbServices';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {FlatList} from 'react-native';
import {Icon, Modal, Portal} from 'react-native-paper';
import LeadEditForm from '../components/lead/LeadEditModal';
import {RootStackParamList} from '../components/Navigation/StackNavigator';

type HomeProps = NativeStackScreenProps<
  BottomTabParamList & RootStackParamList,
  'Home'
>;

const Home = ({navigation, route}: HomeProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {db, error, loading} = useDatabase();

  const [leads, setLeads] = useState<LeadType[]>([]);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const handleNavigation = () => {
    navigation.navigate('Add');
  };

  const handleGetAllLeads = useCallback(async () => {
    if (db) {
      try {
        const leads = await getLeadItems(db);
        setLeads(leads);
      } catch (err) {
        console.error('Failed to get leads:', err);
      }
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      handleGetAllLeads();
      console.log('Home focused');
    }, [handleGetAllLeads]),
  );

  const handleBackPress = () => {
    if (route.name === 'Home') {
      Alert.alert('Exit App', 'Do you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    } else {
      return false;
    }
  };
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [route.name]),
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        if (db) {
          await deleteLeadItem(db, id);
          setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete lead:', error);
      }
    },
    [db],
  );
  const handleUpdate = (item: LeadType) => {
    navigation.navigate('Edit', {lead: item});
  };

  const renderLeadItem = ({item}: {item: LeadType}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => console.log('ViewDetails', item)}
      style={{
        ...styles.cardWrapper,
        backgroundColor: isDarkMode ? '#f4f4f4' : 'black',
      }}>
      <Text
        style={{
          ...styles.leadText,
          color: isDarkMode ? 'black' : '#f4f4f4',
        }}>
        Name: {item.name}
      </Text>
      <Text
        style={{
          ...styles.leadText,
          color: isDarkMode ? 'black' : '#f4f4f4',
        }}>
        Phone: {item.phone}
      </Text>
      <Text
        style={{
          ...styles.leadText,
          color: isDarkMode ? 'black' : '#f4f4f4',
        }}>
        Status: {item.status}
      </Text>
      <Text
        style={{
          ...styles.leadText,
          color: isDarkMode ? 'black' : '#f4f4f4',
        }}>
        Description: {item.description.substr(0, 30)}...
      </Text>
      <View style={styles.buttonContainer}>
        <Text
          style={{
            ...styles.leadText,
            color: isDarkMode ? 'black' : '#f4f4f4',
          }}
          onPress={() => {
            if (item.id !== undefined) {
              handleUpdate(item);
            }
          }}>
          <Icon source={'pencil'} size={20} color="blue" /> Edit
        </Text>
        <Text
          style={{
            ...styles.leadText,
            color: isDarkMode ? 'black' : '#f4f4f4',
          }}
          onPress={() => {
            if (item.id !== undefined) {
              handleDelete(item.id);
            }
          }}>
          <Icon source={'delete'} size={20} color="red" /> Delete
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: isDarkMode ? 'black' : '#f4f4f4',
        }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: isDarkMode ? 'black' : '#f4f4f4',
        }}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  if (leads.length === 0) {
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: isDarkMode ? 'black' : '#f4f4f4',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        <Text
          style={{...styles.leadText, color: isDarkMode ? '#f4f4f4' : 'black'}}>
          No leads found
        </Text>
        <Text
          onPress={handleNavigation}
          style={{
            padding: 10,
            backgroundColor: 'aqua',
            width: '80%',
            textAlign: 'center',
            alignSelf: 'center',
            borderRadius: 20,
            fontWeight: 'bold',
            elevation: 5,
            color: 'black',
          }}>
          Go to Add
        </Text>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: isDarkMode ? 'black' : '#f4f4f4',
        }}>
        <Text
          style={{
            ...styles.header,
            color: isDarkMode ? '#f4f4f4' : 'black',
          }}>
          Leads
        </Text>
        <FlatList
          data={leads}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderLeadItem}
        />
      </SafeAreaView>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardWrapper: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    height: 200,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'space-evenly',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  leadText: {
    fontSize: 20,
    fontWeight: 'semibold',
  },
});

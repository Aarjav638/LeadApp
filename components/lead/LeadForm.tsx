import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import React, {useCallback} from 'react';
import {AddLeadProps} from '../../screens/AddLead';
import {Button, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {saveLeadItems} from '../../database/dbServices';
import {useDatabase} from '../../hooks/useDataBase';
import {LeadType} from '../../database/typing';

const LeadForm = ({navigation}: AddLeadProps) => {
  const {db, loading} = useDatabase();
  const isDarkMode = useColorScheme() === 'dark';
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState<LeadType>({
    name: '',
    phone: '',
    status: '',
    description: '',
  });
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [error, setError] = React.useState({
    name: '',
    phone: '',
    status: '',
    description: '',
  });

  const handleValidation = useCallback(() => {
    const errors = {name: '', phone: '', status: '', description: ''};
    let valid = true;

    if (!formData.name) {
      errors.name = 'Name is required';
      valid = false;
    }

    if (!formData.phone) {
      errors.phone = 'Phone is required';
      valid = false;
    }

    if (!formData.status) {
      errors.status = 'Status is required';
      valid = false;
    }

    if (!formData.description) {
      errors.description = 'Description is required';
      valid = false;
    }

    setError(errors);
    setIsFormValid(valid);
    return valid;
  }, [formData]);

  const handleSubmit = async () => {
    if (handleValidation()) {
      if (!db) {
        console.log('Database not found');
        return;
      }
      setSaving(true);
      try {
        await saveLeadItems(db, [formData]);

        setFormData({name: '', phone: '', status: '', description: ''});
        setSaving(false);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Failed to save lead:', error);
        setSaving(false);
      } finally {
        setSaving(false);
      }
    } else {
      console.log('Form is invalid');
    }
  };

  const handleChange = (key: keyof LeadType, value: string) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  return (
    <View style={styles.container}>
      <Text style={{...styles.header, color: isDarkMode ? 'grey' : '#000'}}>
        Create Lead
      </Text>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <TextInput
          label="Name"
          mode="outlined"
          autoComplete="name"
          value={formData.name}
          onChangeText={e => {
            handleChange('name', e);
          }}
          activeOutlineColor={isDarkMode ? 'aqua' : ''}
        />
        {error.name !== '' && <Text style={styles.error}>{error.name}</Text>}
        <TextInput
          label="Phone"
          mode="outlined"
          autoComplete="tel"
          keyboardType="phone-pad"
          value={formData.phone}
          activeOutlineColor={isDarkMode ? 'aqua' : ''}
          onChangeText={e => {
            handleChange('phone', e);
          }}
          maxLength={10}
        />
        {error.phone !== '' && <Text style={styles.error}>{error.phone}</Text>}
        <TextInput
          label="Status"
          mode="outlined"
          value={formData.status}
          activeOutlineColor={isDarkMode ? 'aqua' : ''}
          onChangeText={e => {
            handleChange('status', e);
          }}
        />
        {error.status !== '' && (
          <Text style={styles.error}>{error.status}</Text>
        )}
        <TextInput
          label="Description"
          mode="outlined"
          multiline={true}
          value={formData.description}
          activeOutlineColor={isDarkMode ? 'aqua' : ''}
          numberOfLines={10}
          onChangeText={e => {
            handleChange('description', e);
          }}
        />
        {error.description !== '' && (
          <Text style={styles.error}>{error.description}</Text>
        )}

        <Button mode="contained" onPress={handleSubmit}>
          {saving ? 'Submitting...' : 'Submit'}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    gap: 20,
  },
  error: {
    color: 'red',
  },
});

export default LeadForm;

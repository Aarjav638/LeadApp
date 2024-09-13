import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {Button, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {updateLeadItem} from '../../database/dbServices';
import {useDatabase} from '../../hooks/useDataBase';
import {LeadType} from '../../database/typing';
import {LeadEditFormProps} from '../../screens/EditLeads';

const LeadEditForm = ({navigation, route}: LeadEditFormProps) => {
  const {lead} = route.params;
  const {db} = useDatabase();
  const isDarkMode = useColorScheme() === 'dark';
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState(lead);

  const handleSubmit = async () => {
    if (!db) {
      console.log('Database not found');
      return;
    }
    setSaving(true);
    try {
      const updatedData = {
        id: lead.id,
        name: formData.name.trim() !== '' ? formData.name : lead.name,
        phone: formData.phone.trim() !== '' ? formData.phone : lead.phone,
        status: formData.status.trim() !== '' ? formData.status : lead.status,
        description:
          formData.description.trim() !== ''
            ? formData.description
            : lead.description,
      };
      await updateLeadItem(db, updatedData);

      setFormData({name: '', phone: '', status: '', description: ''});
      setSaving(false);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to edit lead:', error);
      setSaving(false);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof LeadType, value: string) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  return (
    <View style={styles.container}>
      <Text style={{...styles.header, color: isDarkMode ? 'grey' : '#000'}}>
        Edit Lead
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
        <TextInput
          label="Status"
          mode="outlined"
          value={formData.status}
          activeOutlineColor={isDarkMode ? 'aqua' : ''}
          onChangeText={e => {
            handleChange('status', e);
          }}
        />
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
});

export default LeadEditForm;

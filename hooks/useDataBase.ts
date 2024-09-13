import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {useEffect, useState} from 'react';
import {getDBConnection} from '../database/dbServices';

export const useDatabase = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const dbConnection = await getDBConnection();
        setDb(dbConnection);
        console.log('DB Connected Successfully', dbConnection);
        setLoading(false);
      } catch (err) {
        console.error('Failed to connect to database:', err);
        setError('Failed to connect to database');
        setLoading(false);
      }
    };

    initDB();
  }, []);

  return {db, loading, error};
};

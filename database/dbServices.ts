import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {LeadType} from './typing';

const tableName = 'leaddata';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'lead-data.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        name TEXT NOT NULL ,  phone TEXT NOT NULL, description TEXT NOT NULL, status TEXT NOT NULL
    );`;

  await db.executeSql(query);
};

export const getLeadItems = async (db: SQLiteDatabase): Promise<LeadType[]> => {
  try {
    const leadItems: LeadType[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id,name,phone,description,status FROM ${tableName}`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        leadItems.push(result.rows.item(index));
      }
    });
    return leadItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

export const saveLeadItems = async (
  db: SQLiteDatabase,
  leadItems: LeadType[],
) => {
  const insertQuery =
    `INSERT INTO ${tableName}(name, phone, status, description) values` +
    leadItems
      .map(
        i => `('${i.name}', '${i.phone}', '${i.status}', '${i.description}')`,
      )
      .join(',');

  return db.executeSql(insertQuery);
};

export const updateLeadItem = async (
  db: SQLiteDatabase,
  leadItem: LeadType,
) => {
  const updateQuery = `UPDATE ${tableName} set name = '${leadItem.name}', phone = '${leadItem.phone}', status = '${leadItem.status}', description = '${leadItem.description}' where rowid = ${leadItem.id}`;
  await db.executeSql(updateQuery);
};

export const deleteLeadItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};

import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {getLeadItems} from '../database/dbServices';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Platform, PermissionsAndroid} from 'react-native';
import FileViewer from 'react-native-file-viewer';
const getLeads = async (db: SQLiteDatabase) => {
  try {
    if (db) {
      const leads = await getLeadItems(db);
      return leads;
    }
  } catch (error) {
    console.error('Failed to get leads:', error);
  }
};

const handleDownload = async (db: SQLiteDatabase) => {
  const leads = await getLeads(db);
  const permission = await requestStoragePermission();
  if (!permission) {
    return;
  }
  try {
    console.log('Generating pdf');

    let PDFOptions = {
      html: `
      <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
            h2{
              text-align: center;}
        </style>
      </head>
      <body>
        <h2 >Leads</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
          ${leads
            ?.map(
              lead =>
                `<tr>
                  <td>${lead.name}</td>
                  <td>${lead.phone}</td>
                  <td>${lead.description}</td>
                  <td>${lead.status}</td>
                </tr>`,
            )
            .join('')}
        </table>
      </body>
      </html>
      `,

      fileName: 'file',
      directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
    };
    let file = await RNHTMLtoPDF.convert(PDFOptions);
    if (!file.filePath) {
      return;
    }
    console.log('PDF generated', file.filePath);
    FileViewer.open(file.filePath, {showOpenWithDialog: true})
      .then(() => {
        console.log('File opened successfully');
      })
      .catch(error => {
        console.error('Failed to open file:', error);
      });
  } catch (error) {
    console.log('Failed to generate pdf', (error as any).message);
  }
};

export {handleDownload};

export async function requestStoragePermission() {
  var permissionGranted = false;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'This app needs access to your storage to download files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Storage permission granted');
      permissionGranted = true;
    } else {
      console.log('Storage permission denied');
    }
    return permissionGranted;
  } catch (err) {
    console.warn(err);
  }
}

import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {getDBConnection, getLeadItems} from '../database/dbServices';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Alert, Platform} from 'react-native';
import axios from 'axios';
import FileViewer from 'react-native-file-viewer';
import {
  PERMISSIONS,
  RESULTS,
  check,
  requestMultiple,
} from 'react-native-permissions';
import {LeadType} from '../database/typing';
import RNFS from 'react-native-fs';
type PermissionStatus =
  | 'unavailable'
  | 'denied'
  | 'limited'
  | 'granted'
  | 'blocked';

const getLeads = async (db: SQLiteDatabase) => {
  try {
    if (db) {
      const leads: LeadType[] = await getLeadItems(db);
      return leads;
    }
  } catch (error) {
    console.error('Failed to get leads:', error);
  }
};

const handlePdfGeneration = async (db: SQLiteDatabase) => {
  const leads = await getLeads(db);
  if (leads?.length === 0) {
    Alert.alert('No leads found');
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
      base64: true,
    };
    let file = await RNHTMLtoPDF.convert(PDFOptions);
    if (!file.filePath) {
      return;
    }
    console.log('PDF generated', file.filePath);
    return file.filePath;
  } catch (error) {
    console.log('Failed to generate pdf', (error as any).message);
  }
};

const handleDownload = async (db: SQLiteDatabase) => {
  const permission = await requestStoragePermission();
  if (!permission) {
    return;
  }
  try {
    let file = await handlePdfGeneration(db);
    if (file) {
      await savePDF(file);
      FileViewer.open(file, {showOpenWithDialog: true})
        .then(() => {
          console.log('File opened successfully');
        })
        .catch(error => {
          console.error('Failed to open file:', error);
        });
    }
  } catch (error) {
    console.log('Failed to generate pdf', (error as any).message);
  }
};

export {handleDownload, getPrinters, handlePrint};

export async function requestStoragePermission() {
  const checkPermission: PermissionStatus = await check(
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION
      : PERMISSIONS.IOS.PHOTO_LIBRARY,
  );

  if (checkPermission === RESULTS.GRANTED) {
    return true;
  }
  if (checkPermission === RESULTS.BLOCKED) {
    Alert.alert('Permission blocked', 'Please enable permission from settings');
    return false;
  }
  const permission: Record<string, PermissionStatus> = await requestMultiple(
    Platform.OS === 'android'
      ? [
          PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ]
      : [PERMISSIONS.IOS.PHOTO_LIBRARY],
  );
  if (
    permission[
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION ||
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.PHOTO_LIBRARY
    ] === RESULTS.GRANTED
  ) {
    return true;
  }
}

const savePDF = async (filePath: string) => {
  try {
    const newPath = `${RNFS.DownloadDirectoryPath}/leads_report.pdf`;
    await RNFS.copyFile(filePath, newPath);
    console.log('PDF saved at:', newPath);
    Alert.alert('PDF saved at:', 'Download/leads_report.pdf');
  } catch (err) {
    console.error('Failed to save PDF file:', err);
  }
};

const handlePrint = async (printerId: string) => {
  try {
    const db = await getDBConnection();
    const apiKey = 'Y7Owrj-XkaKnYnPPImgWuhLsF6UnBrq1Wq59EGjn83s';
    const printerIds = printerId;

    if (!printerIds) {
      Alert.alert('Error', 'Please select a printer before printing');
      return;
    }
    const pdfPath = await handlePdfGeneration(db);
    if (!pdfPath) {
      return;
    }
    const pdfBase64 = await RNFS.readFile(pdfPath, 'base64');

    const response = await axios.post(
      'https://api.printnode.com/printjobs',
      {
        printerId: printerId,
        title: 'Leads PDF Print',
        contentType: 'pdf_base64',
        content: pdfBase64,
      },
      {
        auth: {
          username: apiKey,
          password: '',
        },
      },
    );

    if (response.data) {
      Alert.alert('Success', 'PDF sent to printer successfully');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to print PDF');
    console.error('Printing Error: ', error);
  }
};

const getPrinters = async () => {
  try {
    const apiKey = 'Y7Owrj-XkaKnYnPPImgWuhLsF6UnBrq1Wq59EGjn83s';
    const response = await axios.get('https://api.printnode.com/printers', {
      auth: {
        username: apiKey,
        password: '',
      },
    });
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching printers', error);
    Alert.alert('Error', 'Failed to load printers');
  }
};

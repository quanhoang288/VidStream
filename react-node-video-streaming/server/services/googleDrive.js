const fs = require('fs');
const { google } = require('googleapis');
const { GOOGLE_DRIVE_API_VERSION } = require('../configs');

module.exports = class GoogleDriveService {
  constructor(clientId, clientSecret, redirectUri, refreshToken) {
    this.driveClient = this.createDriveClient(
      clientId,
      clientSecret,
      redirectUri,
      refreshToken,
    );
  }

  createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({ refresh_token: refreshToken });
    return google.drive({
      version: GOOGLE_DRIVE_API_VERSION,
      auth: client,
    });
  }

  createFolder(folderName) {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name',
    });
  }

  searchFolder(folderName) {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(res.data.files ? res.data.files[0] : null);
          }
        },
      );
    });
  }

  saveFile(fileName, filePath, fileMimeType, folderId) {
    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
  }

  downloadPartialContent(fileId, range) {
    console.log('range: ', range);
    return this.driveClient.files.get(
      {
        fileId,
        alt: 'media',
      },
      { headers: { Range: range }, responseType: 'stream' },
    );
  }

  downloadFile(fileId) {
    return this.driveClient.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'stream' },
    );
  }
};

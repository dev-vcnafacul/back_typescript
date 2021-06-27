import fs from "fs"
const { google } = require('googleapis');

const credentials = require('../config/credentials.json')

const TOKEN_PATH = require('../config/token.json')


export class DownloadGoogleDriveAPI{

  public Download(fileid: string, dest: string){

    const nome = `${new Date().getTime()}.jpeg`

    const destino = fs.createWriteStream(dest + nome)
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oAuth2Client.credentials = TOKEN_PATH

    return !this.DownloadImageAuth(fileid, destino, oAuth2Client)
    
  }

  private DownloadImageAuth(fileId: string, destinofs: fs.WriteStream, auth: any): boolean{
    const drive = google.drive({version: 'v3', auth});

    let error = false

    drive.files.get({
      fileId: fileId,
      alt: 'media'
    },  {
      responseType: 'stream'
    }, (err, response) => {
      if(err) {
        error = true
        console.log(err);
        return error
      } 
      response.data.on('error', err => {
        console.log(err)
        error = true
        return error
      }).on('end', () => {
        console.log(fileId)
      })
      .pipe(destinofs)
    })

    return error
  }
}

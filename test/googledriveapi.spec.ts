import test from 'japa'
import { DownloadGoogleDriveAPI } from '../Features/GoogleDriveAPI/Downloader/index'

import fs from 'fs'



test.group('Google Drive API', (group) => {

  group.after(async () => {
    const path = __dirname.replace('test', "uploads\\images\\testes")
    fs.readdirSync(path).forEach(file => {
      fs.unlinkSync(path + `\\${file}`)
    })
  })

  test('Download Imagem Google Drive API', (assert)=>{

    const fileid = '1qo1UwNL2GMo5EURxXg_c_eBUh8f5LRSu'

    const GoogleDriveAPI = new DownloadGoogleDriveAPI();

    assert.isTrue(GoogleDriveAPI.Download(fileid, 'uploads/images/testes/'))

  })

  test('Download Imagem Google Drive API Pasta Compartilhada', (assert)=>{

    const fileid = '197QDIt-e1ui6GvG8ySFHPyIbwGbFz1fP'

    const GoogleDriveAPI = new DownloadGoogleDriveAPI();

    assert.isTrue(GoogleDriveAPI.Download(fileid, 'uploads/images/teste/'))

  }) 
})
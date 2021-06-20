import test from 'japa'
import { DownloadGoogleDriveAPI } from '../Features/GoogleDriveAPI/Downloader/index'

test.group('Google Drive API', () => {
  test('Download Imagem Google Drive API', (assert)=>{

    const fileid = '1qo1UwNL2GMo5EURxXg_c_eBUh8f5LRSu'

    const GoogleDriveAPI = new DownloadGoogleDriveAPI();

    assert.isTrue(GoogleDriveAPI.Download(fileid, 'uploads/images/'))

  })
})
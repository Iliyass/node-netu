require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
  encoding: 'utf8',
});
import { expect } from 'chai';
import NetuUpload, { getUploadServer, uploadFile, publishFile } from '../api';
import path from 'path';
const debug = require('debug')('netu-test');

var _USER_TOKEN = process.env.NETU_USER_TOKEN
debug('USER TOKEN', _USER_TOKEN)
let uploadServer = {}
describe('Netu tests', () => {
  it('should get server and upload hashes', async () => {
    expect(_USER_TOKEN).to.be.a('string')
    const data = await getUploadServer(_USER_TOKEN)
    expect(data.uploadServer).to.be.a('string');
    expect(data.hash).to.be.a('string');
    expect(data.timeHash).to.be.a('number');
    expect(data.userId).to.be.a('string');
    expect(data.keyHash).to.be.a('string');
    uploadServer = data
    uploadServer.userToken = _USER_TOKEN
  })

  it('should upload a local file', async function() {
    this.timeout(100000)
    debug('Upload Info', uploadServer)
    const file = {
      path: path.join(__dirname, './sample.mp4')
    }
    const data = await uploadFile(uploadServer, file)
    expect(data).to.equal(true)

  })

  it('should publish the previous file uploaded', async function() {
    this.timeout(100000)
    const file = {
      path: path.join(__dirname, './sample.mp4'),
      name: 'sample.mp4'
    }
    const data = await publishFile(uploadServer, file)
    expect(data).to.have.property('embed_code_non_secured')
    expect(data).to.have.property('vid')
    expect(data).to.have.property('videokey')
  })

  it('should throw exceptions based on args', async function(){
    this.timeout(100000)
    const file = {
      path: path.join(__dirname, './sample.mp4'),
      name: 'sample.mp4'
    }
    const data = await NetuUpload(file, {
      userToken: _USER_TOKEN
    })
    expect(data).to.have.property('embed_code_non_secured')
    expect(data).to.have.property('vid')
    expect(data).to.have.property('videokey')
  })
})

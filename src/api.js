import request from 'request-promise';
import assert from 'assert';
import fs from 'fs';

const debug = require('debug')('netu-api');

const _GET_UPLOAD_SERVER = "http://netu.tv/plugins/cb_multiserver/api/get_upload_server.php"
const _UPLOAD_ENDPOINT = "http://netu.tv/actions/file_uploader.php"

export const getUploadServer = async function getUploadServer(userToken, endpoint = _GET_UPLOAD_SERVER){
  assert(userToken, "User token is undefined")
  const _USER_HASH_KEY = 'user_hash'
  const requestConfig = {
    url: endpoint,
    method: 'GET',
    json: true,
    qs: {
      [_USER_HASH_KEY]: userToken
    }
  }
  try{
    const response = await request(requestConfig);
    if(response && response.error){
      throw new Error(response.error)
    }
    return {
      uploadServer: response.upload_server,
      hash: response.hash,
      timeHash: response.time_hash,
      userId: response.userid,
      keyHash: response.key_hash
    }
  }
  catch(e){
    throw new Error("Can't get Netu Upload Server")
  }
} 

export const uploadFile = async function uploadFile(serverInfo, file){
  const requestConfig = {
    url: serverInfo.uploadServer,
    method: 'POST',
    formData: {
      'hash': serverInfo.hash,
      'time_hash': serverInfo.timeHash,
      'userid': serverInfo.userId,
      'key_hash': serverInfo.keyHash,
      'Filedata': fs.createReadStream(file.path),
      'upload': 1
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    json: true
  }

  try{
    const response = await request(requestConfig);
    if(response && response.error){
      debug('response error', response)
      throw new Error(response.error)
    }
    debug(response)
    if(response && response.success && response.success === 'yes'){
      return true
    }
    throw new Error('Cant Upload File')
  }catch(e){
    throw new Error(e)
  }
}

export const publishFile = async function publishFile(serverInfo, file){
  const requestConfig = {
    method: 'POST',
    url: _UPLOAD_ENDPOINT,
    json: true,
    form: { 
        insertVideo: 'yes',
        title: file.name,
        server: serverInfo.uploadServer,
        user_hash: serverInfo.userToken,
        file_name: file.name
    } 
  }

  try{
    const response = await request(requestConfig);
    if(response && response.error){
      debug('response error', response)
      throw new Error(response.error)
    }
    debug(response)
    return response
  }catch(e){
    throw new Error(e)
  }

}

const upload = async function upload(file, config){
  assert(file, "file is required")
  assert(config, "config is required")
  const { path, name } = file
  const { userToken } = config
  assert(path, "file path is required")
  assert(userToken, "config.userToken is required")

  try{
    let serverInfo = await getUploadServer(userToken)
    serverInfo.userToken = userToken
    const uploadResponse = await uploadFile(serverInfo, file)
    serverInfo = { ...serverInfo, ...uploadResponse }
    const fileUploaded = await publishFile(serverInfo, file)
    return fileUploaded
  }catch(e){
    throw new Error(e)
  }
}

export default upload
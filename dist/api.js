'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publishFile = exports.uploadFile = exports.getUploadServer = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('netu-api');

var _GET_UPLOAD_SERVER = "http://netu.tv/plugins/cb_multiserver/api/get_upload_server.php";
var _UPLOAD_ENDPOINT = "http://netu.tv/actions/file_uploader.php";

var getUploadServer = exports.getUploadServer = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(userToken) {
    var endpoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _GET_UPLOAD_SERVER;

    var _USER_HASH_KEY, requestConfig, response;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _assert2.default)(userToken, "User token is undefined");
            _USER_HASH_KEY = 'user_hash';
            requestConfig = {
              url: endpoint,
              method: 'GET',
              json: true,
              qs: (0, _defineProperty3.default)({}, _USER_HASH_KEY, userToken)
            };
            _context.prev = 3;
            _context.next = 6;
            return (0, _requestPromise2.default)(requestConfig);

          case 6:
            response = _context.sent;

            if (!(response && response.error)) {
              _context.next = 9;
              break;
            }

            throw new Error(response.error);

          case 9:
            return _context.abrupt('return', {
              uploadServer: response.upload_server,
              hash: response.hash,
              timeHash: response.time_hash,
              userId: response.userid,
              keyHash: response.key_hash
            });

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](3);
            throw new Error("Can't get Netu Upload Server");

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 12]]);
  }));

  function getUploadServer(_x) {
    return _ref.apply(this, arguments);
  }

  return getUploadServer;
}();

var uploadFile = exports.uploadFile = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(serverInfo, file) {
    var requestConfig, response;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            requestConfig = {
              url: serverInfo.uploadServer,
              method: 'POST',
              formData: {
                'hash': serverInfo.hash,
                'time_hash': serverInfo.timeHash,
                'userid': serverInfo.userId,
                'key_hash': serverInfo.keyHash,
                'Filedata': _fs2.default.createReadStream(file.path),
                'upload': 1
              },
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              json: true
            };
            _context2.prev = 1;
            _context2.next = 4;
            return (0, _requestPromise2.default)(requestConfig);

          case 4:
            response = _context2.sent;

            if (!(response && response.error)) {
              _context2.next = 8;
              break;
            }

            debug('response error', response);
            throw new Error(response.error);

          case 8:
            debug(response);

            if (!(response && response.success && response.success === 'yes')) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt('return', true);

          case 11:
            throw new Error('Cant Upload File');

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](1);
            throw new Error(_context2.t0);

          case 17:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 14]]);
  }));

  function uploadFile(_x3, _x4) {
    return _ref2.apply(this, arguments);
  }

  return uploadFile;
}();

var publishFile = exports.publishFile = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(serverInfo, file) {
    var requestConfig, response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            requestConfig = {
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
            };
            _context3.prev = 1;
            _context3.next = 4;
            return (0, _requestPromise2.default)(requestConfig);

          case 4:
            response = _context3.sent;

            if (!(response && response.error)) {
              _context3.next = 8;
              break;
            }

            debug('response error', response);
            throw new Error(response.error);

          case 8:
            debug(response);
            return _context3.abrupt('return', response);

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](1);
            throw new Error(_context3.t0);

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 12]]);
  }));

  function publishFile(_x5, _x6) {
    return _ref3.apply(this, arguments);
  }

  return publishFile;
}();

var upload = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(file, config) {
    var path, name, userToken, serverInfo, uploadResponse, fileUploaded;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            (0, _assert2.default)(file, "file is required");
            (0, _assert2.default)(config, "config is required");
            path = file.path, name = file.name;
            userToken = config.userToken;

            (0, _assert2.default)(path, "file path is required");
            (0, _assert2.default)(userToken, "config.userToken is required");

            _context4.prev = 6;
            _context4.next = 9;
            return getUploadServer(userToken);

          case 9:
            serverInfo = _context4.sent;

            serverInfo.userToken = userToken;
            _context4.next = 13;
            return uploadFile(serverInfo, file);

          case 13:
            uploadResponse = _context4.sent;

            serverInfo = (0, _extends3.default)({}, serverInfo, uploadResponse);
            _context4.next = 17;
            return publishFile(serverInfo, file);

          case 17:
            fileUploaded = _context4.sent;
            return _context4.abrupt('return', fileUploaded);

          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4['catch'](6);
            throw new Error(_context4.t0);

          case 24:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[6, 21]]);
  }));

  function upload(_x7, _x8) {
    return _ref4.apply(this, arguments);
  }

  return upload;
}();

exports.default = upload;

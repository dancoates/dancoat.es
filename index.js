require('babel-register');
require('app-module-path').addPath('./src');
require('dotenv').config({silent: true});
require('./src/server/server.js');
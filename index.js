require('app-module-path').addPath('./src');
require('babel-register');
require('dotenv').config({silent: true});
require('./src/server/server.js');
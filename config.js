'use strict';
require('dotenv').config();

const config = {
    server: {
        port: process.env.SERVER_PORT || 5000,
        host: process.env.SERVER_HOST || '0.0.0.0'
    },
    ws_host: process.env.WS_HOST
};

global.config = config;
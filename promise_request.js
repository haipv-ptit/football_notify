'use strict';

const request = require('request');

const sendGetRequest = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, {
            headers: {
                'content-type' : 'application/json'
            },
            json: true
        }, (error, response, data) => {
            _formatResponse(error, data, resolve, reject)
        });
    });
};

const sendPostRequest = (url, headers, body) => {
    return new Promise((resolve, reject) => {
        let _header = {'content-type' : 'application/json'};
        if(headers !== null) {
            _header = {'content-type' : 'application/json', ...headers};
        }
        request.post(url, {
            headers: _header,
            json: true,
            body: body
        }, (error, response, data) => {
            _formatResponse(error, data, resolve, reject)
        });
    });
};

const _formatResponse = (error, data, resolve, reject) => {
    if(error) {
        console.log(`send error: ${JSON.stringify(error)}`);
        reject(error);
    } else {
        if(data.hasOwnProperty("error") && data['error']) {
            reject(data);
        } else {
            resolve(data);
        }
    }
};

module.exports = {
    get: sendGetRequest,
    post: sendPostRequest
};

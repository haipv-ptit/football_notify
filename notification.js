'use strict';
const event_manager = require('./event_manager');
const request = require('./promise_request');

const fcm_url = 'https://fcm.googleapis.com/fcm/send';

let send = (data) => {
    let key = 'event_'+data['id']+'_'+data['time'];
    if(event_manager.checkEvent(key)) {
        return;
    }
    let time = new Date().getTime()/1000;
    time += 900;
    let message = {
        condition: data['condition'],
        notification: {
            title: data['title'],
            body: data['body']
        },
        data: data['payload'],
        android: {
            collapse_key: 'match_'+data['id'],
            ttl: '900s'  // 15 min
        },
        apns: {
            headers:{
                'apns-expiration': time
            }
        },
    };
    //console.log(data['condition']);
    //console.log(data['title'] + '\n' + data['body']+'\n=====');
    _sendToFcm(message).then(result => {
        //console.log(result);
    }).catch(err => {
        //console.error(err);
    });
};

let _sendToFcm = async (message) => {
    let authorization = 'key='+config.fcm_key;
    return await request.post(fcm_url, {Authorization: authorization}, message);
};

module.exports = {
    send: send
};
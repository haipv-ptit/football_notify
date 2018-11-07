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
    let tag = 'match_'+data['id'];
    let message = {
        condition: data['condition'],
        notification: {
            title: data['title'],
            body: data['body'],
            tag: tag
        },
        data: data['payload'],
        android: {
            collapse_key: tag,
            ttl: '900s'  // 15 min
        },
        apns: {
            headers:{
                'apns-expiration': time
            }
        }
    };
    //console.log(data['condition']);
    //console.log(data['title'] + '\n' + data['body']+'\n=====');
    _sendToFcm(message, config.fcm_key).then(result => {
        //console.log(result);
    }).catch(err => {
        //console.error(err);
    });
    //
    let oldKey = 'AAAA0Cv-XUE:APA91bHn81X7L2gZ3HuwRGQbyELk2nx3ROZLWov52rpWQ6T8lWkok5uIgj_I3AGwCCRTuj8JAAhhL002K5taP8iNy8R-z2OkvUi_vlhT6ljCaNac-UkWAvOmGTVEyXun1_zWh5P49Y6V';
    _sendToFcm(message, oldKey).then(result => {
        //console.log(result);
    }).catch(err => {
        //console.error(err);
    });
};

let _sendToFcm = async (message, key) => {
    let authorization = 'key='+key;
    return await request.post(fcm_url, {Authorization: authorization}, message);
};

module.exports = {
    send: send
};
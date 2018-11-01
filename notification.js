'use strict';
const event_manager = require('./event_manager');

let send = (data) => {
    let key = 'event_'+data['id']+'_'+data['time'];
    if(event_manager.checkEvent(key)) {
        return;
    }
    console.log(data['title'] + '\n' + data['body']+'\n=====\n');
};

module.exports = {
    send: send
};
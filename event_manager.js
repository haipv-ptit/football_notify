'use strict';
const TIME_INTERVAL = 60000;
const TIME_ALIVE = 60000;
let monitorId = 0;
let events = {};

let checkEvent = (key) => {
    if(events.hasOwnProperty(key)) {
        return true;
    }
    events[key] = 120000+new Date().getTime();
    return false;
};

let putEvent = (key, value) => {
    events[key] = value;
};

let _resetEvents = () => {
    let _now = new Date().getTime();
    for(let key in events) {
        if(!events.hasOwnProperty(key)) {
            continue;
        }

        let value = events[key];
        if(_now - value < TIME_ALIVE) {
            continue;
        }
        delete events[key];
    }
};

let monitorEvents = () => {
    clearInterval(monitorId);
    monitorId = setInterval(_resetEvents, TIME_INTERVAL);
};

module.exports = {
    monitorEvents: monitorEvents,
    checkEvent: checkEvent,
    putEvent: putEvent
};

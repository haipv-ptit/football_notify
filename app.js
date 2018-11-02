require('./config');
const presenter = require('./presenter');
const event_manager = require('./event_manager');
const events  = ["team_35", "team_2817", "team_2829", "team_42"];

let WebSocket = require('ws');

function connectWs() {
    let time = new Date().getTime();
    let ws = new WebSocket(config.ws_host+time+"-0");

    ws.on('open', function() {
       // console.log('open: ');
        ws.send(JSON.stringify({"type":0,"data":["subscribe",{"id":"event","events":events}]}), function(e) {
        });
    });

    ws.on('message', function(message) {
        presenter.onDataReceived(message);
    });

    ws.on('close', function(code) {
       // console.log('Disconnected: ' + code);
        setTimeout(function() {
            connectWs();
        }, 1000);
    });

    ws.on('error', function(error) {
       // console.log('Error: ' + error.code);
    });
}
event_manager.monitorEvents();
connectWs();

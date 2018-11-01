require('./config');
const presenter = require('./presenter');
const manager = require('./event_manager');

var WebSocket = require('ws');
var _now = new Date();
let index = 0;
let time = _now.getTime();

function connectWs() {
    var ws = new WebSocket("wss://ws.sofascore.com:10012/ServicePush/?_primuscb="+time+"-"+index);

    ws.on('open', function() {
        console.log('open: ');
        // ws.send(JSON.stringify({"type":0,"data":["subscribe",{"id":"event","events":["event_8012788", "team_22007", "event_8012750", "event_8012788", "team_6119", "team_6108"]}]}), function(e) {
        // });
        ws.send(JSON.stringify({"type":0,"data":["subscribe",{"id":"event","events":["sport_football"]}]}), function(e) {
        });
    });


    ws.on('message', function(message) {
        presenter.onDataReceived(message);
    });

    ws.on('close', function(code) {
        console.log('Disconnected: ' + code + '_' +index);
        setTimeout(function() {
            index++;
            connectWs();
        }, 1000);
    });

    ws.on('error', function(error) {
        console.log('Error: ' + error.code);
    });
}

//connectWs();
test();
function test() {
    manager.putEvent('vt_1541049325000', 1541049325000);
    manager.putEvent('vt_1541049445000', 1541049445000);
    manager.putEvent('vt_1541049565000', 1541049565000);
    manager.putEvent('vt_1541049685000', 1541049685000);
    manager.putEvent('vt_1541049805000', 1541049805000);
    manager.putEvent('vt_1541049925000', 1541049925000);
    console.log(manager.checkEvent('vt_1541049805000'));
    console.log(manager.checkEvent('vt_1541050225000'));
    manager.monitorEvents();
    manager.monitorEvents();
}

'use strict';
const helper = require('./helper');

let checkDataChanged = (result) => {
    let res = JSON.parse(result);
    if(helper.isEmpty(res) || helper.isEmpty(res['data'])) {
        return false;
    }
    if(!Array.isArray(res['data']) || res['data'].length < 2) {
        return false;
    }
    let data = res['data'][1];
    if(helper.isEmpty(data['service']) || data['service'] !== 'event') {
        return false;
    }
    data = data['data'];
    if(helper.isEmpty(data['changesData'])) {
        return false;
    }
    return data;
};

let onDataReceived = (res) => {
    let data = checkDataChanged(res);
    if(data === false) {
        return;
    }
    let changesData = data['changesData'];
    if(!helper.isEmpty(changesData['status']) && changesData['status'] === true) {
        onStatusChanged(data);
        return
    }
    if(!helper.isEmpty(changesData['score']) && changesData['score'] === true) {
        onScoreChanged(data);
    }
};

let onStatusChanged = (res) => {
    let data = {};
    data['home'] = res['homeTeam']['shortName'];
    data['away'] = res['awayTeam']['shortName'];
    data['id'] = res['id'];
    data['status'] = res['status']['description'];
    data['homeScore'] = res['homeScore']['current'];
    data['awayScore'] = res['awayScore']['current'];
    console.log(data['home'] + ' - ' + data['away'] + '\n' +
        data['status'] + ' ' + data['homeScore'] + ' - ' +  data['awayScore']+'\n=========\n');
};

let onScoreChanged = (res) => {
    let data = {};
    data['home'] = res['homeTeam']['shortName'];
    data['away'] = res['awayTeam']['shortName'];
    data['id'] = res['id'];
    data['status'] = res['status']['description'];
    data['homeScore'] = res['homeScore']['current'];
    data['awayScore'] = res['awayScore']['current'];
    let body = data['homeScore'] + ' - ' +  data['awayScore'];
    if(res['changesData']['home']['score'] === true) {
        body = '[' + data['homeScore'] + '] - ' +  data['awayScore'];
    } else  if(res['changesData']['away']['score'] === true) {
        body = data['homeScore'] + ' - [' +  data['awayScore'] + ']';
    }
    console.log(data['home'] + ' - ' + data['away'] + '\n' +
        body +'\n=========\n');
};

module.exports = {
    onDataReceived: onDataReceived
};

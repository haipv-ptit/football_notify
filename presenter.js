'use strict';
const helper = require('./helper');
const notification = require('./notification');

let checkDataChanged = (result) => {
    let res = JSON.parse(result);
    if (helper.isEmpty(res) || helper.isEmpty(res['data'])) {
        return false;
    }
    if (!Array.isArray(res['data']) || res['data'].length < 2) {
        return false;
    }
    let data = res['data'][1];
    if (helper.isEmpty(data['service']) || data['service'] !== 'event') {
        return false;
    }
    data = data['data'];
    if (helper.isEmpty(data['changesData'])) {
        return false;
    }
    return data;
};

let onDataReceived = (res) => {
    let data = checkDataChanged(res);
    if (data === false) {
        return;
    }
    let changesData = data['changesData'];
    if (!helper.isEmpty(changesData['status']) && changesData['status'] === true) {
        onStatusChanged(data);
        return
    }
    if (!helper.isEmpty(changesData['score']) && changesData['score'] === true) {
        onScoreChanged(data);
    }
};

let onStatusChanged = (res) => {
    let homeScore = res['homeScore']['current'];
    let awayScore = res['awayScore']['current'];
    let nameHome = res['homeTeam']['shortName'];
    let nameAway = res['awayTeam']['shortName'];
    let payload = _buildPayload(res);
    payload['event'] = 'status';
    let body = res['status']['description'] + ': ' + homeScore + ' - ' + awayScore;
    let message = {'payload': payload};
    message['title'] = nameHome + ' - ' + nameAway;
    message['body'] = body;
    message['condition'] = _buildCondition(res);
    notification.send(message);
};

let onScoreChanged = (res) => {
    let homeScore = res['homeScore']['current'];
    let awayScore = res['awayScore']['current'];
    let nameHome = res['homeTeam']['shortName'];
    let nameAway = res['awayTeam']['shortName'];
    let payload = _buildPayload(res);
    payload['type'] = 'match';
    payload['event'] = 'score';
    let body = homeScore + ' - ' + awayScore;
    if (res['changesData']['home']['score'] === true) {
        body = '[' + homeScore + '] - ' + awayScore;
    } else if (res['changesData']['away']['score'] === true) {
        body = homeScore + ' - [' + awayScore + ']';
    }
    let message = {'payload': payload};
    message['title'] = nameHome + ' - ' + nameAway;
    message['body'] = body;
    message['condition'] = _buildCondition(res);
    notification.send(message);
};

let _buildPayload = (res) => {
    return {
        id: res['id'],
        status: res['status'],
        time: res['changes']['changeTimestamp'],
        type: 'match'
    };
};

let _buildCondition = (res) => {
    let team1 = 'match_team_' + res['homeTeam']['id'];
    let team2 = 'match_team_' + res['awayTeam']['id'];
    return "'" + team1 + "' in topics || '" + team2 + "' in topics";
};

module.exports = {
    onDataReceived: onDataReceived
};

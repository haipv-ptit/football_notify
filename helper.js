'use strict';

function isEmpty(data) {
    if(data === undefined || data == null) {
        return true;
    }
    if(typeof data === "string" && data.trim().length === 0) {
        return true;
    }
    if( Array.isArray(data) && data.length === 0) {
        return true;
    }
    return false;
}

function wrapSuccess(res, data) {
    return res.status(200).json({status: 1, data: data, message: 'success'});
}

function wrapFailure(res, error) {
    return res.status(200).json({status: 0, error: error});
}

module.exports = {
    isEmpty: isEmpty,
    wrapSuccess: wrapSuccess,
    wrapFailure: wrapFailure
};

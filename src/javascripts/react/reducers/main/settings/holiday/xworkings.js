'use strict';

import { combineReducers } from 'redux';

function data(state=[], action){
    switch (action.type){
        case 'XWORKINGS_REFRESH':
            return action.value;
        default:
            return state;
    }
}

function displayMode(state=true, action){
    switch (action.type){
        case 'XWORKINGS_DISPLAY_MODE':
            return !state;
        default:
            return state;
    }
}

function openModal(state=false, action){
    switch (action.type){
        case 'XWORKINGS_MODAL_OPEN':
            return action.value;
        default:
            return state;
    }
}

const xworkings = combineReducers({
    data,
    displayMode,
    openModal
});

export default xworkings;

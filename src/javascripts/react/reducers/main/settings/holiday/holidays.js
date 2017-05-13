'use strict';

import { combineReducers } from 'redux';

function data(state=[], action){
    switch (action.type){
        case 'HOLIDAYS_REFRESH':
            return action.value;
        default:
            return state;
    }
}

function displayMode(state=true, action){
    switch (action.type){
        case 'HOLIDAYS_DISPLAY_MODE':
            return !state;
        default:
            return state;
    }
}

function openModal(state=false, action){
    switch (action.type){
        case 'HOLIDAYS_MODAL_OPEN':
            return action.value;
        default:
            return state;
    }
}

function modalLoading(state=false, action){
    switch (action.type){
        case 'HOLIDAYS_MODAL_LOADING':
            return action.value;
        default:
            return state;
    }
}

const holidays = combineReducers({
    data,
    displayMode,
    openModal,
    modalLoading
});

export default holidays;

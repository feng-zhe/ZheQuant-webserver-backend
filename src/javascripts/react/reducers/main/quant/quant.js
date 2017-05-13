'use strict';

import { combineReducers } from 'redux';

const CONSOLE = 'console';
const RESULTS = 'results';

function activeItem(state = RESULTS , action){
    switch (action.type){
        case 'QUANT_ACTIVEITEM_CHANGE':
            return action.value;
        default:
            return state;
    }
}

function results(state = [], action){
    switch (action.type){
        case 'QUANT_RESULTS_UPDATE':
            return action.value;
        default:
            return state;
    }
}

function modalStatus(state = false, action){
    switch (action.type){
        case 'QUANT_MODAL_STATUS':
            return action.value;
        default:
            return state;
    }
}

function detailIndex(state = 0, action){
    switch (action.type){
        case 'QUANT_DETAIL_INDEX':
            return action.value;
        default:
            return state;
    }
}

const quantReducer = combineReducers({
    activeItem,
    results,
    modalStatus,
    detailIndex
});

export default quantReducer;

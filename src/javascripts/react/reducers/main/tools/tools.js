'use strict';

import { combineReducers } from 'redux';

function activeItem(state = 'repayment dates', action){
    switch (action.type){
        case 'TOOLSVIEW_ACTIVEITEM_CHANGE':
            return action.value;
        default:
            return state;
    }
}

function repayDates(state = [], action) {
    switch (action.type) {
        case 'REPAY_DATES_RECEIVING':
            return action.value ? action.value : state;
        default:
            return state;
    }
}

const toolsReducer = combineReducers({
    activeItem,
    repayDates
});

export default toolsReducer;

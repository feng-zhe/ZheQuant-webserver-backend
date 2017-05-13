'use strict';

import { combineReducers } from 'redux';
import holidays from './holidays';
import xworkings from './xworkings';

function activeItem(state='holiday',action){
    switch (action.type){
        case 'HOLIDAYVIEW_ACTIVEITEM_CHANGE':
            return action.value;
        default:
            return state;
    }
}

const holidayReducer = combineReducers({
    activeItem,
    holidays,
    xworkings
});

export default holidayReducer;

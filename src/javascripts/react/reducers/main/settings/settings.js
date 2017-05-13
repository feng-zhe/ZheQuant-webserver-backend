'use strict';

import { combineReducers } from 'redux';
import holiday from './holiday/holiday';

function activeItem(state = 'account', action){
    switch (action.type){
        case 'SETTINGSVIEW_ACTIVEITEM_CHANGE':
            return action.value;
        default:
            return state;
    }
}

const settingsReducer = combineReducers({
    activeItem,
    holiday
});

export default settingsReducer;

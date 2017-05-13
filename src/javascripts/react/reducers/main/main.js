'use strict';

import { combineReducers } from 'redux';
import tools from './tools/tools.js';
import settings from './settings/settings.js';
import quant from './quant/quant.js';

function activeItem(state = 'home', action) {
    switch(action.type){
        case 'MAINVIEW_ACTIVEITEM_CHANGE':
            return action.value;
        default:
            return state;
    }
}

const mainViewReducer = combineReducers({
    activeItem,
    quant,
    tools,
    settings,
});

export default mainViewReducer;

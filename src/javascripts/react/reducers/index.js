'use strict';

import { combineReducers } from 'redux';
import main from './main/main.js';

function auth(state = {}, action) {
    switch (action.type) {
        case 'USER_AUTH_SUCCESS':
            return action.value;
        case 'USER_AUTH_FAILURE':
            return action.value;
        default:
            return state;
    }
}

// the total reducer function
const reducers = combineReducers({
    auth,
    main
});

export default reducers;

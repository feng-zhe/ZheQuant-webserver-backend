'use strict';

import { connect } from 'react-redux';
import DateTableImp , { stateHelper, dispatchHelper } from './dateTable';
import config from 'config.json';

const backend_url = config.backend_url;

// SpecialWorkingDaysTable
const XWorkingDateTable = connect(
    (state) => {
        const auth = state.auth;
        const xworkings = state.main.settings.holiday.xworkings;
        return stateHelper(auth, xworkings);
    },
    (dispatch) => {
        const url = backend_url+'/user/settings/xworkings';
        const types = {
            display_mode: 'XWORKINGS_DISPLAY_MODE',
            refresh: 'XWORKINGS_REFRESH', 
            modal_open: 'XWORKINGS_MODAL_OPEN',
            modal_loading: 'XWORKINGS_MODAL_LOADING'
        };
        return dispatchHelper(dispatch, url, types);
    }
)(DateTableImp);

export default XWorkingDateTable;

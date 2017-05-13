'use strict';

import { connect } from 'react-redux';
import DateTableImp , { stateHelper, dispatchHelper } from './dateTable';
import config from 'config.json';

const backend_url = config.backend_url;

// HolidaysTable
const HolidaysDateTable = connect(
    (state) => {
        const auth = state.auth;
        const holidays = state.main.settings.holiday.holidays;
        return stateHelper(auth, holidays);
    },
    (dispatch) => {
        const url = backend_url+'/user/settings/holidays';
        const types = {
            display_mode: 'HOLIDAYS_DISPLAY_MODE',
            refresh: 'HOLIDAYS_REFRESH', 
            modal_open: 'HOLIDAYS_MODAL_OPEN',
            modal_loading: 'HOLIDAYS_MODAL_LOADING'
        };
        return dispatchHelper(dispatch, url, types);
    }
)(DateTableImp);

export default HolidaysDateTable;

'use strict';

import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Menu, Container, Divider } from 'semantic-ui-react';
import config from 'config.json';
import XWorkingDateTable from './xworkings';
import HolidaysDateTable from './holidays';

const backend_url = config.backend_url;

// Holiday
class HolidayImp extends React.Component {
    constructor(props){
        super(props);
        // init
        this.props.onInit(this.props.auth);
    }
    render(){
        return (
                <Container textAlign='center'>
                    <Menu compact>
                        <Menu.Item name='holiday' active={this.props.activeItem==='holiday'} onClick={this.props.onMenuItemClick} />
                        <Menu.Item name='working' active={this.props.activeItem==='working'} onClick={this.props.onMenuItemClick} />
                    </Menu>
                    <Divider />
                    {this.props.activeItem==='holiday'&&<HolidaysDateTable />}
                    {this.props.activeItem==='working'&&<XWorkingDateTable />}
                </Container>
               );
    }
}
const Holiday = connect(
        (state) => {
            return {
                auth: state.auth,
                activeItem: state.main.settings.holiday.activeItem
            };
        },
        (dispatch) => {
            return {
                onInit: (auth) => {
                    // init the holidays
                    $.post(backend_url+'/user/settings/holidays',{
                        userId: auth.userId,
                        token: auth.token
                    })
                    .done(function(data){
                        const action = {
                            type: 'HOLIDAYS_REFRESH',
                            value: data
                        };
                        dispatch(action);
                    })
                    .fail(function(){
                        alert('network issue');
                    });
                    // init the special working days
                    $.post(backend_url+'/user/settings/xworkings',{
                        userId: auth.userId,
                        token: auth.token
                    })
                    .done(function(data){
                        const action = {
                            type: 'XWORKINGS_REFRESH',
                            value: data
                        };
                        dispatch(action);
                    })
                    .fail(function(){
                        alert('network issue');
                    });
                },
                onMenuItemClick: (e, { name })=>{
                    const action = {
                        type: 'HOLIDAYVIEW_ACTIVEITEM_CHANGE',
                        value: name
                    };
                    dispatch(action);
                }
            };
        }
    )(HolidayImp);

export default Holiday;

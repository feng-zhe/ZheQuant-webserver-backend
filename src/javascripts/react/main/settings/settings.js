'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Grid, Menu } from 'semantic-ui-react';
import AccountView from './account.js';
import HolidayView from './holiday/holiday.js';

// presentational components
class SettingsImp extends React.Component {
    render(){
        return (
            <Grid>
                <Grid.Column width={4}>
                    <Menu pointing secondary vertical>
                        <Menu.Item name='account' active={this.props.activeItem === 'account'} onClick={this.props.onMenuItemClick} />
                        <Menu.Item name='holiday' active={this.props.activeItem === 'holiday'} onClick={this.props.onMenuItemClick} />
                    </Menu>
                </Grid.Column>
                <Grid.Column width={10}>
                    { this.props.activeItem==='account' && <AccountView />}
                    { this.props.activeItem==='holiday' && <HolidayView />}
                </Grid.Column>
                <Grid.Column width={2} />
            </Grid>
        );
    }
}

// container components
const mapStateToProps = (state) => {
    return {
        activeItem: state.main.settings.activeItem
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onMenuItemClick: (e, { name }) => {
            const action = {
                type: 'SETTINGSVIEW_ACTIVEITEM_CHANGE',
                value: name
            };
            dispatch(action);
        }
    };
};
const Settings = connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsImp);

// exports
export default Settings;

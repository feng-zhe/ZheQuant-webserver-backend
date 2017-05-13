'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Grid, Menu } from 'semantic-ui-react';
import RepayDates from './repay_dates.js';

// presentational components
class ToolsImp extends React.Component {
    render(){
        return (
            <Grid>
                <Grid.Column width={4}>
                    <Menu pointing secondary vertical>
                        <Menu.Item name='repayment dates' active={this.props.activeItem === 'repayment dates'} onClick={this.props.onMenuItemClick} />
                        <Menu.Item name='other tools' active={this.props.activeItem === 'other tools'} onClick={this.props.onMenuItemClick} />
                    </Menu>
                </Grid.Column>
                <Grid.Column width={10}>
                    { this.props.activeItem==='repayment dates' && <RepayDates /> }
                </Grid.Column>
                <Grid.Column width={2} />
            </Grid>
        );
    };
}

// container components
const mapStateToProps = (state) => {
    return {
        activeItem: state.main.tools.activeItem
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onMenuItemClick: (e, { name }) => {
            const action = {
                type: 'TOOLSVIEW_ACTIVEITEM_CHANGE',
                value: name
            };
            dispatch(action);
        }
    };
};
const Tools = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolsImp);

// exports
export default Tools;

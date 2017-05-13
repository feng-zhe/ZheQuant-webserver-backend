'use strict';

import React from 'react';
import { Grid, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import ConsoleView from './console/console.js'
import ResultsView from './results/results.js'

// presentational component
class QuantImp extends React.Component {
    render(){
        const CONSOLE = 'console';
        const RESULTS = 'results';
        return (
            <Grid>
                <Grid.Column width={4}>
                    <Menu pointing secondary vertical>
                        <Menu.Item name={CONSOLE} active={this.props.activeItem === CONSOLE} onClick={this.props.onMenuItemClick} />
                        <Menu.Item name={RESULTS} active={this.props.activeItem === RESULTS} onClick={this.props.onMenuItemClick} />
                    </Menu>
                </Grid.Column>
                <Grid.Column width={10}>
                    { this.props.activeItem===CONSOLE && <ConsoleView />}
                    { this.props.activeItem===RESULTS && <ResultsView />}
                </Grid.Column>
                <Grid.Column width={2} />
            </Grid>
        );
    }
}

// container component
const mapStateToProps = (state) => {
    return {
        activeItem: state.main.quant.activeItem
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        onMenuItemClick: (e, { name }) => {
            const action = {
                type: 'QUANT_ACTIVEITEM_CHANGE',
                value: name
            };
            dispatch(action);
        }
    };
};
const Quant = connect(
    mapStateToProps,
    mapDispatchToProps
)(QuantImp);

// exports
export default Quant;

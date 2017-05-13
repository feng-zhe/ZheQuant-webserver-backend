'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Menu, Segment } from 'semantic-ui-react';
import ToolsView from './tools/tools.js';
import HomeView from './home/home.js';
import QuantView from './quant/quant.js';
import SettingsView from './settings/settings.js';

// presentational components
class MainImp extends React.Component {
    render() {
        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Item name='home' active={this.props.activeItem === 'home'} onClick={this.props.onMenuItemClick} />
                    <Menu.Item name='quant' active={this.props.activeItem === 'quant'} onClick={this.props.onMenuItemClick} />
                    <Menu.Item name='tools' active={this.props.activeItem === 'tools'} onClick={this.props.onMenuItemClick}/>
                    <Menu.Menu position='right'>
                    <Menu.Item name='settings' active={this.props.activeItem === 'settings'} onClick={this.props.onMenuItemClick} />
                    <Menu.Item name='logout' active={this.props.activeItem === 'logout'} onClick={this.props.onMenuItemClick} />
                    </Menu.Menu>
                </Menu>

                { this.props.activeItem === 'home' && <HomeView /> }
                { this.props.activeItem === 'quant' && <QuantView /> }
                { this.props.activeItem === 'tools' && <ToolsView /> }
                { this.props.activeItem === 'settings' && <SettingsView /> }
            </div>
        );
        
    }
}

// container component
const mapStateToProps = (state) => {
    return {
        activeItem: state.main.activeItem
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onMenuItemClick: (e, { name }) => {
            const action = {
                type: 'MAINVIEW_ACTIVEITEM_CHANGE',
                value: name
            };
            dispatch(action);
        }
    };
};
const Main = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainImp);

// exports
export default Main;

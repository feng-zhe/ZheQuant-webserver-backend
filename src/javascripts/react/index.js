'use strict';

// note that we have to use "React" and "ReactDOM"
import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import myreducer from './reducers/index.js';
import MainView from './main/main.js';
import LoginView from './login.js';

const store = createStore(myreducer);

// presentational component
class IndexImp extends React.Component {
    render() {
        return ( this.props.logged? <MainView /> : <LoginView /> ) ;
    }
}

// container component
const mapStateToProps = (state, ownProps) => {
    return {
        logged: state.auth.success
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};
const Index = connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexImp);

render(
    <Provider store={store}>
        <Index />
    </Provider>,
    document.getElementById('root'));

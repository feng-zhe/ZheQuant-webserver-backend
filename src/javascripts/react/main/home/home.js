'use strict';

import React from 'react';
import { connect } from 'react-redux';

// presentational component
class HomeImp extends React.Component {
    render(){
        return (
            <p>This is the home page</p>
        );
    }
}

// container component
const mapStateToProps = (state) => {
    return {
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
    };
}

const Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeImp);

export default Home;

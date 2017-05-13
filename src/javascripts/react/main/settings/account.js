'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';

// presentational components
class AccountImp extends React.Component {
    render(){
        return (
            <p> this is Account settings page </p>
        );
    }
}

// container components
const mapStateToProps = (state) => {
    return {
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
    };
}
const Account = connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountImp);

export default Account;

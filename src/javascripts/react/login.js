'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Message, Input, Grid, Header, Button, Form, Segment, Icon } from 'semantic-ui-react';
import $ from 'jquery';
import crypto from 'crypto';
import config from 'config.json';

let BACKEND_URL = config.backend_url;

// presentational components
class LoginImp extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let message = null;
        if(this.props.auth && this.props.auth.success===false){
            message = (
                <Message error>
                    <Message.Header>Login Failed</Message.Header>
                </Message>
            );
        }
        return (
            <Grid columns='2' verticalAlign='middle' textAlign='center' className="fullheight">
                <Grid.Column>
                    <Header as='h2' color='teal'>
                        <Header.Content> Login to your account </Header.Content>
                    </Header>
                    <Form size='large' onSubmit={this.props.onSubmit}>
                        <Segment stacked>
                            <Form.Field>
                                <Input iconPosition='left' placeholder="User ID" >
                                    <Icon name='user' />
                                    <input name="userId"  />
                                </Input>
                            </Form.Field>
                            <Form.Field>
                                <Input iconPosition='left' placeholder="Password">
                                    <Icon name='lock' />
                                    <input name="password" type="password" />
                                </Input>
                            </Form.Field>
                            <Button fluid size='large' color='teal' type='submit'>Login</Button>
                        </Segment>
                        <div className="ui error message"></div>
                    </Form>
                    { message }
                </Grid.Column>
            </Grid>
        );
    }
}

// container component
const mapStateToProps = (state, ownProps) => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSubmit: (e, data) => {
            e.preventDefault();
            // send to login api
            $.post(BACKEND_URL + '/user/auth/', {
                userId: data.userId,
                password: crypto.createHash('md5').update(data.password).digest('hex')
            })
            .done(function(data) {
                const action = {
                    type: 'USER_AUTH_SUCCESS',
                    value: data
                };
                dispatch(action);
            })
            .fail(function(e) {
                alert('network error');
            });
        }
    };
};

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginImp);


// exports
export default Login;

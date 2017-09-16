'use strict';

import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Container, Form, Input, Label} from 'semantic-ui-react';
import config from 'config.json';

// presentational component
class ConsoleImp extends React.Component {
    command(cmd) {
        // parse the command string
        // e.g.: schedule -n jobname -dsc "moving average" -t mv-avg -p "-d 20 -n 5"
        const cmd_strs = cmd.match(/(?:[^\s"]+|"[^"]*")+/g);
        let job_name, dsc;
        for(let i=0;i<cmd_strs.length;++i){
            if(cmd_strs[i]==='-n'){
                job_name = cmd_strs[++i];
            } else if(cmd_strs[i]==='-dsc'){
                dsc = cmd_strs[++i];
                if(dsc.charAt(0)==='"'){ // remove the potential quotes
                    dsc = dsc.substring(1, dsc.length-1);
                }
            }
        }
        // send to backend service
        if(!job_name){
            alert('missing job name');
            return;
        }
        $.post(config.backend_url + '/quant/jobs', {
            userId: this.props.auth.userId,
            token: this.props.auth.token,
            job_name: job_name,
            description: dsc,
            cmd: cmd
        })
        .done(function(data){
            alert('job scheduled');
        })
        .fail(function(){
            alert('network error');
        });
    }
    render(){
        const command = this.command.bind(this);
        const onSubmit = function(e, data){
            e.preventDefault();
            command(data.cmd);
        }
        return (
            <Container textAlign='center'>
                <Form size='large' onSubmit={onSubmit}>
                    <Form.Field>
                        <Input name='cmd' placeholder='Enter Command Here' />
                    </Form.Field>
                </Form>
                <Label> schedule -n jobname -dsc "moving average" -t mv_avg -p "-d 20 -n 5" </Label>
            </Container>
        );
    }
}

// container component
const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
    };
}

const Console = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConsoleImp);

export default Console;

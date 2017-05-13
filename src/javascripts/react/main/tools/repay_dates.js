'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Table, Menu} from 'semantic-ui-react';
import $ from 'jquery';
import config from 'config.json';

let BACKEND_URL = config.backend_url;

// presentational components
class RepayDaysImp extends React.Component {
    render() {
        const types = [{
            text: 'Month',
            value: 'MONTH'
        }];
        return (
            <div className='ui raised very padded text container segment'>
                <Form onSubmit={this.props.onSubmit.bind(this)} >
                    <Form.Field>
                        <label>What is the start day of the loan?</label>
                        <input type='date' name='startDate' placeholder='YYYY-MM-DD' />
                    </Form.Field>
                    <Form.Field>
                        <label>How long would it be between two repayment?</label>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <input type='number' name='intervalValue' min='1'/>
                            </Form.Field>
                            <Form.Select name='intervalType' options={types} placeholder='Type' />
                        </Form.Group>
                    </Form.Field>
                    <Form.Field>
                        <label>How many times of repayment in total?</label>
                        <input type='number' name='totalTimes' min='1'/>
                    </Form.Field>
                    <Button type='submit'>Submit</Button>
                </Form>
                { this.props.repayDates.length>0 &&
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Order</Table.HeaderCell>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {
                            this.props.repayDates.map(function(odate,i){
                                return (
                                    <Table.Row key={i}>
                                        <Table.Cell>{i+1}</Table.Cell>
                                        <Table.Cell>{`${odate.year}-${odate.month+1}-${odate.date}`}</Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                        </Table.Body>
                    </Table>
                }
            </div>
        )
    }
}

// container components
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        repayDates: state.main.tools.repayDates
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: function(e) {
            e.preventDefault();
            // do the post query
            const startDate = $('input[name="startDate"]').val();
            $.post(BACKEND_URL+'/loan', {
                userId: this.props.auth.userId,
                token: this.props.auth.token,
                startDate: startDate,
                intervalType: $('select[name="intervalType"]').val(),
                intervalValue: $('input[name="intervalValue"]').val(),
                totalTimes: $('input[name="totalTimes"]').val()
            })
            .done(function(data) {
                const action = {
                    type: 'REPAY_DATES_RECEIVING',
                    value: data.repayDates
                };
                dispatch(action);
            })
            .fail(function(){
                alert('Sorry, query failed!');
            });
        }
    };
};
const RepayDays = connect(
    mapStateToProps,
    mapDispatchToProps
)(RepayDaysImp);

// exports
export default RepayDays;

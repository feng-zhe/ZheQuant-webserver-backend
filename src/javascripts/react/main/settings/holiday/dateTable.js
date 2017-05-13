'use strict';

import $ from 'jquery';
import React from 'react';
import { Table, Button, Icon, Modal, Form } from 'semantic-ui-react';

class DateTable extends React.Component {
    render(){
        const display = this.props.displayMode;
        const open = this.props.openModal;
        const loading = this.props.modalLoading;
        const onDeleteClick = this.props.onDeleteClick.bind(this);
        return (
            <Table celled compact definition>
                <Table.Header fullWidth>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell>Year</Table.HeaderCell>
                        <Table.HeaderCell>Month</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        this.props.dates.map(function(data,i){
                            return (
                            <Table.Row key={i}>
                                <Table.Cell collapsing>
                                    <Button disabled={display} 
                                        onClick={
                                            function(){
                                                onDeleteClick(data.year, data.month, data.date);
                                            }
                                        } 
                                        icon='trash outline' />
                                </Table.Cell>
                                <Table.Cell>{data.year}</Table.Cell>
                                <Table.Cell>{data.month + 1}</Table.Cell>
                                <Table.Cell>{data.date}</Table.Cell>
                            </Table.Row>
                            );
                        })
                    }
                </Table.Body>

                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell colSpan='3'>
                            <Button disabled={display} onClick={this.props.onAddClick.bind(this)} floated='right' icon labelPosition='left' primary size='small'>
                                <Icon name='add' /> Add
                            </Button>
                            <Modal open={open} >
                                <Modal.Header>Add a new entry</Modal.Header>
                                    <Modal.Content>
                                        <Modal.Description>
                                            <Form id='date_table_form' onSubmit={this.props.onModalSubmit.bind(this)}>
                                                <Form.Group widths='equal'>
                                                  <Form.Input label='Year' name='year' placeholder='year' />
                                                  <Form.Input label='Month' name='month' placeholder='Month' />
                                                  <Form.Input label='Date' name='date' placeholder='Date' />
                                                </Form.Group>
                                            </Form>
                                        </Modal.Description>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button negative onClick={this.props.onModalCancel.bind(this)}>Cancel</Button>
                                        <Button positive loading={this.props.loading} type='submit' form='date_table_form' >Ok</Button>
                                    </Modal.Actions>
                            </Modal>
                            <Button toggle active={!display} onClick={this.props.onDisplayClick.bind(this)}>
                                { display? <Icon name='eye' /> : <Icon name='pencil' /> }
                                { display? 'Displaying' : 'Editing' }
                            </Button>
                            <Button toggle onClick={this.props.onRefresh.bind(this)}>Refresh</Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        );
    }
}

function stateHelper(auth, own_state){
    return {
        auth: auth,
        dates: own_state.data,
        displayMode: own_state.displayMode,
        openModal: own_state.openModal,
        modalLoading: own_state.modalLoading
    };
}

function dispatchHelper(dispatch, url, types) {
    return {
        onDisplayClick: function(){ // change the display/edit mode
            const action = {
                type: types.display_mode
            };
            dispatch(action);
        },
        onRefresh: function(){ // refresh the holiday list
            $.post(url ,{
                userId: this.props.auth.userId,
                token: this.props.auth.token
            })
            .done(function(data){
                const action = {
                    type: types.refresh,
                    value: data
                };
                dispatch(action);
            })
            .fail(function(){
                alert('network issue');
            });
        },
        onAddClick: function(){
            const action = {
                type: types.modal_open,
                value: true
            };
            dispatch(action);
        },
        onDeleteClick: function(year, month, date){
            const doneFunc = this.props.onRefresh.bind(this);
            $.ajax({
                url: url, 
                method: 'DELETE',
                data: {
                    userId: this.props.auth.userId,
                    token: this.props.auth.token,
                    data: JSON.stringify({ year, month, date})
                }
            })
            .done(doneFunc)
            .fail(function(){
                alert('network issue');
            });
        },
        onModalCancel: function(){ // close the dialog
            const action = {
                type: types.modal_open,
                value: false
            };
            dispatch(action);
        },
        onModalSubmit: function(e, form_data){// submit new entry to server
            e.preventDefault();
            // start loading
            const loading_action = {
                type: types.modal_loading,
                value: true
            }
            dispatch(loading_action);
            // prepare the functions
            const onRefresh = this.props.onRefresh.bind(this);
            const doneFunc = function(){
                onRefresh();
                // end loading
                const loading_action = {
                    type: types.modal_loading,
                    value: false
                }
                dispatch(loading_action);
                // close the modal
                const close_action = {
                    type: types.modal_open,
                    value: false
                };
                dispatch(close_action);
            }
            // send put request
            $.ajax({
                url: url,
                method: 'PUT',
                data: {
                    userId: this.props.auth.userId,
                    token: this.props.auth.token,
                    data: JSON.stringify(form_data)
                }
            })
            .done(doneFunc)
            .fail(function(){
                alert('network issue');
            });
        }
    }
}

export { DateTable as default, stateHelper, dispatchHelper }; 

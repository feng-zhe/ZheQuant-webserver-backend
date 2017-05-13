'use strict';

import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Container, Table, Button, Modal} from 'semantic-ui-react';
import config from 'config.json';

// presentational component
class ResultsImp extends React.Component {
    constructor(props) {
        super(props);
        (this.props.refresh.bind(this))();
    }
    render() {
        const closeModal = () => {
            this.props.setModal(false);
        }
        return (
            <Container textAlign='center'>
                <Button icon="refresh" onClick={this.props.refresh.bind(this)}/>
                <Table celled compact definition singleLine>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Create Date</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Details</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                        this.props.results.map( (result,i) => {
                            const onDetail = () => {
                                this.props.setDetailIndex(i);
                                this.props.setModal(true);
                            }
                            return (
                                <Table.Row key={i} textAlign='center'>
                                    <Table.Cell>{result.name}</Table.Cell>
                                    <Table.Cell>{result.create_date}</Table.Cell>
                                    <Table.Cell>{result.status}</Table.Cell>
                                    <Table.Cell>{result.description}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button icon='browser' onClick={onDetail}/>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                    </Table.Body>
                </Table>
                <Modal open={this.props.modalStatus} onClose={closeModal}>
                    <Modal.Header>Details</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <p>
                                {
                                    this.props.results[this.props.detailIndex] && this.props.results[this.props.detailIndex].result
                                }
                                </p>
                            </Modal.Description>
                        </Modal.Content>
                </Modal>
            </Container>
        );
    }
}

// container component
const mapStateToProps = (state) => {
    // sort results first
    const results = [];
    for(const elem of state.main.quant.results){
        results.push(elem);
    }
    results.sort(function(a,b){
        const da = new Date(a.create_date);
        const db = new Date(b.create_date);
        if(da.getTime() > db.getTime()) {
            return -1;
        } else if(da.getTime() < db.getTime()) {
            return 1;
        } else {
            return 0;
        }
    });
    return {
        auth: state.auth,
        results: results,
        modalStatus: state.main.quant.modalStatus,
        detailIndex: state.main.quant.detailIndex
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        refresh: function() {
            $.post(config.backend_url + '/quant/results', {
                    userId: this.props.auth.userId,
                    token: this.props.auth.token
                })
                .done(function(data) {
                    const action = {
                        type: 'QUANT_RESULTS_UPDATE',
                        value: data.results
                    };
                    dispatch(action);
                })
                .fail(function() {
                    alert('network error');
                });
        },
        setModal: function(value){
            const action = {
                type: 'QUANT_MODAL_STATUS',
                value: value
            };
            dispatch(action);
        },
        setDetailIndex: function(index){
            const action = {
                type: 'QUANT_DETAIL_INDEX',
                value: index
            };
            dispatch(action);
        }
    };
}

const Results = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResultsImp);

export default Results;

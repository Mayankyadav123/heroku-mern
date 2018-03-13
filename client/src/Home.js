import React, { Component } from 'react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { Icon, Menu, Table } from 'semantic-ui-react'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { firstName: '', lastName: '', lastNameSearch: '', currentPage: 1 };
        
        this.onLastNameSearchChange = this.onLastNameSearchChange.bind(this);
        this.updateResults = this.updateResults.bind(this);
        this.updateResults = debounce(this.updateResults, 300);
    }

    onLastNameSearchChange(event) {
        this.setState({ lastNameSearch: event.target.value });
        this.updateResults();
    }

    updateResults() {
        this.props.searchPersonsByLastName(this.state.lastNameSearch);
    }

    componentWillMount() {
        this.fetchPersons(this.state.currentPage);
    }

    fetchPersons(page) {
        this.setState({ currentPage: page });
        this.props.fetchPersons(page);
    }

    componentDidMount() {
        this.setState({firstName: '', lastName: '' });
    }

    onPersonDelete(person) {
        this.props.deletePerson(this.props.persons, person);
        if (this.state.currentPage !== 1)
        {
            this.setState({ currentPage: 1 });
            this.fetchPersons(this.state.currentPage);
        }
    }
    
    renderList() {
        return(
            map(this.props.persons.persons, (person) => {
                return (
                    <Table.Row key={person._id}>
                        <Table.Cell>
                            <Link to={`/person/${person._id}`} style={{float: 'left', minWidth: '60px', paddingRight: '15px'}}>
                                {person.firstname} {person.lastname}
                            </Link>
                        </Table.Cell>
                        <Table.Cell>
                            <button className="ui button" onClick={() => this.onPersonDelete(person)}>Delete</button>
                        </Table.Cell>
                    </Table.Row>
                );
            })
        );
    }

    displayList() {
        if (typeof this.props.persons.persons !== 'undefined' && this.props.persons.totalPersonsCount !== 0) {
            return(
                <div>
                    <input
                        className="form-control"
                        type="text"
                        value={this.state.lastNameSearch}
                        onChange={this.onLastNameSearchChange} />

                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.renderList()}
                        </Table.Body>
                        {this.displayPaging()}
                    </Table>               
                </div>
            );
        } else {
            return <div>There are no records to display</div>
        }
    }

    displayPaging() {
        let maxRecordsReturned = this.props.persons.maxPersonsReturned;
        let totalRecords = this.props.persons.totalPersonsCount;
        const pages = Math.ceil(totalRecords / maxRecordsReturned);
        const currentPage = { 'fontWeight': 'bold' };
        
        let rows = [];
        if (pages > 1)
        {
            rows.push(<Menu.Item key={'footer_menu_first'} as='a' onClick={() => this.fetchPersons(1)} icon><Icon name="chevron left" /></Menu.Item>);

            for (var i = 0; i < pages; i++) {
                let x = i+1;
                if (x === this.state.currentPage)
                    rows.push(<Menu.Item as='a' key={'paging_' + x} style={currentPage}>{x}</Menu.Item>);
                else
                    rows.push(<Menu.Item as='a' onClick={() => this.fetchPersons(x)} key={'paging_' + x}>{ x }&#160;</Menu.Item>);
            }

            rows.push(<Menu.Item key={'footer_menu_last'} as='a' onClick={() => this.fetchPersons(this.state.currentPage+1)} icon><Icon name="chevron right" /></Menu.Item>);

            return (
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>
                            <Menu pagination>
                            {rows}
                            </Menu>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>);
        } else {
            return(
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>
                            Total Records: {totalRecords}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            )
        }
    }
    
    render() {
        return (
            <div>
                <Link to="/person">Add Person</Link><br/>

                { this.displayList() }
            </div>
        );
    }
}

function mapStateToProps(persons) {
    return {
        persons: persons.persons,
        maxPersonsReturned: persons.persons.maxPersonsReturned,
        totalPersonsCount: persons.persons.totalPersonsCount
    };
}

export default connect(mapStateToProps, actions)(Home);
import React, { Component } from 'react';
import { map } from 'lodash';
import { connect } from 'react-redux';
import * as actions from './actions';
import { Link } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = { firstName: '', lastName: '' };
    }

    componentWillMount() {
        this.props.fetchPersons();
    }

    componentDidMount() {
        this.setState({firstName: '', lastName: '' });
    }

    onPersonDelete(person) {
        this.props.deletePerson(this.props.persons, person);
    }
    
    renderList() {
        return map(this.props.persons.persons, (person) => {
            return (
                <li key={person._id}>
                    <Link to={`/person/${person._id}`} style={{float: 'left', minWidth: '60px', paddingRight: '15px'}}>
                        {person.firstname} {person.lastname}
                    </Link>
                    <button onClick={() => this.onPersonDelete(person)}>Delete</button>
                </li>
            );
        });
    }

    displayList() {
        return(
            <div>
                <Link to="/person">Add Person</Link><br/>
                <ul>{this.renderList()}</ul>
            </div>
        );
    }
    
    render() {
        return (
            <div>
                { this.displayList() }
            </div>
        );
    }
}

function mapStateToProps(persons) {
    return { 
        persons: persons.persons
    };
}

export default connect(mapStateToProps, actions)(Home);
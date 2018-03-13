import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPerson, createOrUpdatePerson } from './actions';
import { Input, Label } from 'semantic-ui-react'


class PersonDetail extends Component {
    constructor(props) {
        super(props);

        this.state = { firstName: '', lastName: '', lastNameSearch: '', personLoaded: false, addOrUpdate: 'Add Person' };
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFirstNameChange(event) {
        this.setState({ firstName: event.target.value });
    }

    onLastNameChange(event) {
        this.setState({ lastName: event.target.value });
    }

    onFormSubmit(event) {
        event.preventDefault();
        this.props.createOrUpdatePerson(this.props.match.params.id, this.state.firstName, this.state.lastName);
        this.props.history.push("/");
    }

    componentWillMount() {
        if (!this.props.person)
        {
            const { id } = this.props.match.params;
            if (typeof(id) !== 'undefined')
            {
                this.props.fetchPerson(id);
            } else {
                this.setState({ personLoaded: true });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.person) {
            const { person } = nextProps;
            this.setState({firstName: person.firstname, lastName: person.lastname, personLoaded: true, addOrUpdate: 'Update Person' });
        }
    }

    render() {
        if (!this.state.personLoaded) {
            return <div>Loading...</div>;
        }
        
        return (
            <div className="container">
                <Link to="/">Home</Link><br/><br/>
               
                <form onSubmit={this.onFormSubmit}>
                    <div className="input">
                        <label>First Name</label>
                        <Input
                            type="text"
                            className="ui input"
                            placeholder="First Name"
                            value={this.state.firstName}
                            onChange={this.onFirstNameChange} />
   
                    </div>
                    <div className="input">
                        <label>Last Name</label>
                        <Input
                            type="text"
                            className="ui input"
                            placeholder="Last Name"
                            value={this.state.lastName}
                            onChange={this.onLastNameChange} />
                    </div>
                    <button type="submit">{ this.state.addOrUpdate }</button>
                </form>
            </div>
        );
    };
}

function mapStateToProps({ persons }, ownProps) {
    return { person: persons[ownProps.match.params.id] }
}

export default connect(mapStateToProps, { fetchPerson, createOrUpdatePerson })(PersonDetail);
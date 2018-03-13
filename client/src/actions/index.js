import axios from 'axios';
import { PERSONS_FETCH, PERSON_FETCH, PERSON_DELETE, PERSON_CREATE, PERSON_UPDATE } from './types';
import { mapKeys } from 'lodash';

let api = '/api/';

if (window.location.hostname.indexOf('localhost') >= 0)
{
    api = 'http://localhost:3030/api/';
}

export function fetchPersons(page) {
    return function (dispatch) {
        axios.get(`${api}members/${page}`).then((returnedData) => {
            let persons = {};
            persons.persons = mapKeys(returnedData.data.persons, '_id');
            persons.maxPersonsReturned = returnedData.data.maxRecordsReturned;
            persons.totalPersonsCount = returnedData.data.totalRecords;
            dispatch(personsFetch(persons));
        });
    }
}

export function fetchPerson(id) {
    return function (dispatch) {
        axios.get(`${api}member/${id}`).then((returnedData) => {
            dispatch(personFetch(returnedData));
        });
    }
}

export function searchPersonsByLastName(lastName) {
    return function (dispatch) {
        axios.get(`${api}members/find/${lastName}`).then((returnedData) => {
            let persons = {};
            persons.persons = mapKeys(returnedData.data.persons, '_id');
            persons.maxPersonsReturned = returnedData.data.maxRecordsReturned;
            persons.totalPersonsCount = returnedData.data.totalRecords;
            dispatch(personsFetch(persons));
        });
    }
}

export function createOrUpdatePerson(id, firstname, lastname) {
    return function (dispatch) {
        axios.post(`${api}member/createOrUpdatePerson`, { id, firstname, lastname }).then((returnedData) => {
            const person = {
                _id: returnedData.data,
                firstname,
                lastname
            };
            
            if (typeof(id) === 'undefined')
                dispatch(personAdd(person));
            else
                dispatch(personUpdate(person));
        });
    }
}

export function deletePerson(persons, person) {
    return function(dispatch) {
        axios.delete(`${api}member/${person._id}`).then((returnedData) => {
            if (returnedData) {
                dispatch(personDelete(person));
            }
        });        
    }
}

// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)

function personsFetch(persons) {
    return {
        type: PERSONS_FETCH,
        payload: persons
    };
}

function personFetch(person) {
    return {
        type: PERSON_FETCH,
        payload: person
    };
}

function personAdd(person) {
    return {
        type: PERSON_CREATE,
        payload: person
    };
}

function personUpdate(person) {
    return {
        type: PERSON_UPDATE,
        payload: person
    };
}

function personDelete(person) {
    return {
        type: PERSON_DELETE,
        payload: person
    };
}
import axios from 'axios';
import { PERSONS_FETCH, PERSON_FETCH, PERSON_DELETE, PERSON_CREATE, PERSON_UPDATE } from './types';
import { mapKeys } from 'lodash';
const api = 'http://localhost:3030/api/';

export function fetchPersons() {
    return function (dispatch) {
        axios.get(`${api}member`).then((returnedData) => {
            const persons = mapKeys(returnedData.data, '_id');
            dispatch(getPersons(persons));
        });
    }
}

export function fetchPerson(id) {
    return function (dispatch) {
        axios.get(`${api}member/${id}`).then((returnedData) => {
            dispatch(getPerson(returnedData));
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

            if (id === 0)
                dispatch(addPerson(person));
            else
                dispatch(updatePerson(person));
        });
    }
}

export function deletePerson(persons, person) {
    return function(dispatch) {
        axios.delete(`${api}member/${person._id}`).then((returnedData) => {
            if (returnedData) {
                dispatch(removePerson(person));
            }
        });        
    }
}

// Action Creators
// --------------------------------------------------------------------------------------------- //
// Actions (execute)

function getPersons(persons) {
    return {
        type: PERSONS_FETCH,
        payload: persons
    };
}

function getPerson(person) {
    return {
        type: PERSON_FETCH,
        payload: person
    };
}

function addPerson(person) {
    return {
        type: PERSON_CREATE,
        payload: person
    };
}

function updatePerson(person) {
    return {
        type: PERSON_UPDATE,
        payload: person
    };
}

function removePerson(person) {
    return {
        type: PERSON_DELETE,
        payload: person
    };
}
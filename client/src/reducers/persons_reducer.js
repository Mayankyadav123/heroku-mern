import {
    PERSONS_FETCH,
    PERSON_FETCH,
    PERSON_CREATE,
    PERSON_UPDATE,
    PERSON_DELETE
} from '../actions/types';
import { omit } from 'lodash';

export default function (state = {}, action) {
    const { type, payload } = action;
    switch (type) {
        case PERSONS_FETCH: {
            return {
                ...state,
                persons: payload.persons,
                maxPersonsReturned: action.payload.maxPersonsReturned,
                totalPersonsCount: action.payload.totalPersonsCount
            };
        }
        case PERSON_FETCH: {
            return { ...state, [action.payload.data._id]: action.payload.data };
        }
        case PERSON_CREATE: {
            const temp = {
                ...state.persons,
                [payload._id]: payload,
            };
            let totalPersonsCount = state.totalPersonsCount;
            totalPersonsCount++;
            return { ...state, persons: temp, totalPersonsCount: totalPersonsCount };
        }
        case PERSON_UPDATE: {
            const temp = {
                ...state.persons,
                [payload._id]: payload
            };
            return { ...state, persons: temp };
        }
        case PERSON_DELETE: {
            let temp = {
                ...state.persons,
                [payload._id]: payload
            };
            let totalPersonsCount = state.totalPersonsCount;
            totalPersonsCount--;

            temp = omit(temp, payload._id);
            return { ...state, persons: temp, totalPersonsCount: totalPersonsCount };
        }
        default:
            return state;
    }
}
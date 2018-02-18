import { combineReducers } from 'redux';
import Persons from './persons_reducer';

const rootReducer = combineReducers({
    persons: Persons
});

export default rootReducer;
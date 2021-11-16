import { combineReducers } from 'redux';

const stacks = (state = [], action) => {
  switch (action.type) {
    case 'SET_STACKS':
      return action.payload;
    // in case the user logs out, reset this information
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

const editStack = (state = {}, action) => {
  switch (action.type) {
    case 'SET_EDIT_STACK':
      return action.payload;
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

const stackStore = combineReducers({
  stacks,
  editStack,
});

export default stackStore;

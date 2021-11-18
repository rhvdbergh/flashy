import { combineReducers } from 'redux';

const classes = (state = [], action) => {
  switch (action.type) {
    case 'SET_CLASSES':
      return action.payload;
    // in case the user logs out, reset this information
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

// holds the current class that is being edited
const editClass = (state = {}, action) => {
  switch (action.type) {
    case 'SET_EDIT_CLASS':
      return action.payload;
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

// holds the classes available to students
const availableClasses = (state = [], action) => {
  switch (action.type) {
    case 'SET_AVAILABLE_CLASSES':
      return action.payload;
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

const classStore = combineReducers({
  classes,
  editClass,
  availableClasses,
});

export default classStore;

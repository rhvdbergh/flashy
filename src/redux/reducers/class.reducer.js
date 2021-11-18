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

// holds the classes that a student is enrolled in
const enrolledClasses = (state = [], action) => {
  switch (action.type) {
    case 'SET_ENROLLED_CLASSES':
      return action.payload;
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

// holds the number of cards that a student needs to review for each class
// this is stored in an object; the key is the id of the specific class
const enrolledClassesOverdueCardCount = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ENROLLED_CARDS_TO_REVIEW':
      return { ...state, [action.payload.class_id]: action.payload.count };
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

const classStore = combineReducers({
  classes,
  editClass,
  availableClasses,
  enrolledClasses,
  enrolledClassesOverdueCardCount,
});

export default classStore;

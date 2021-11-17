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

// holds the current stack that is being edited
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

const cards = (state = [], action) => {
  switch (action.type) {
    case 'SET_CARDS':
      // we add an extra card with empty information
      // the card.id of -1 shows that it doesn't come from the db
      // this is to help keep track of new cards
      return [...action.payload, { id: -1, front: '', back: '' }];
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

const cardsToReview = (state = [], action) => {
  switch (action.type) {
    case 'FETCH_CARDS_TO_REVIEW':
      return action.payload;
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

const stackStore = combineReducers({
  stacks,
  editStack,
  cards,
  cardsToReview,
});

export default stackStore;

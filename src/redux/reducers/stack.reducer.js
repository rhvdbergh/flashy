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
    case 'SET_CARDS_TO_REVIEW':
      // in this array, we want to store the cards to review
      // thus, not the cards that haven't been seen yet
      return action.payload;
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

const totalNumCards = (state = 0, action) => {
  switch (action.type) {
    case 'SET_TOTAL_NUM_CARDS':
      // the action.payload is the total number of cards
      return action.payload;
    case 'LOGOUT':
      return 0;
    default:
      return state;
  }
};

const totalNumNewCards = (state = 0, action) => {
  switch (action.type) {
    case 'SET_CARD_NUMBERS':
      // the action.payload is all the cards that need to be reviewed
      // we want to calculate the number of new cards here
      // calculating the length of the array containing cards with familiarity of 0
      return action.filter((card) => card.familiarity === 0).length;
    case 'LOGOUT':
      return 0;
    default:
      return state;
  }
};

const totalNumReviewCards = (state = 0, action) => {
  switch (action.type) {
    case 'SET_CARD_NUMBERS':
      // the action.payload is all the cards that need to be reviewed
      // we want to calculate the number of older cards that needs to be reviewed here
      // calculating the length of the array containing cards with familiarity of 0
      // calculating the length of the array containing cards with familiarity of 0
      console.log(`in totalNumReviewCards, action.payload=`, action.payload);
      return action.payload.filter((card) => card.familiarity !== 0).length;
    case 'LOGOUT':
      return 0;
    default:
      return state;
  }
};

const stackStore = combineReducers({
  stacks,
  editStack,
  cards,
  cardsToReview,
  totalNumCards,
  totalNumNewCards,
  totalNumReviewCards,
});

export default stackStore;

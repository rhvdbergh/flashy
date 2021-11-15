import { combineReducers } from 'redux';

// sets the nav bar title
const navTitle = (state = '', action) => {
  switch (action.type) {
    case 'SET_NAV_TITLE':
      return action.payload;
    // reset in case of user logout
    case 'LOGOUT':
      return '';
    // in case a title is not necessary, or to ensure wrong title doesn't display
    case 'RESET_NAV_TITLE':
      return '';
    default:
      return state;
  }
};

// tells the nav bar whether to display the back button or not
// default is true, yes it's displaying
const displayBackButton = (state = true, action) => {
  switch (action.type) {
    case 'SET_DISPLAY_BACK_BUTTON':
      return action.payload;
    case 'LOGOUT':
      return true;
    default:
      return state;
  }
};

const utils = combineReducers({
  navTitle,
  displayBackButton,
});

export default utils;

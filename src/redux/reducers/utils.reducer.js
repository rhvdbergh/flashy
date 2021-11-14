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

export default navTitle;

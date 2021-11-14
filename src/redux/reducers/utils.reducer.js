// sets the nav bar title
const navTitle = (state = '', action) => {
  switch (action.type) {
    case 'SET_NAV_TITLE':
      return action.payload;
    default:
      return state;
  }
};

export default navTitle;

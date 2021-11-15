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

export default classes;

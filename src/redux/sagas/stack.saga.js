import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

// fetches stacks belonging to the logged in teacher from the server
function* fetchStacks(action) {
  try {
    const response = yield axios.get('/api/stack');
    yield put({ type: 'SET_STACKS', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga retrieving the stacks from the server:`,
      err
    );
  }
}

// deletes a specific stack on the server belonging to the logged in teacher
function* deleteStack(action) {
  try {
    yield axios.delete(`/api/stack/${action.payload}`);
    // refresh the redux store and the DOM
    yield put({ type: 'FETCH_STACKS' });
    yield put({ type: 'FETCH_CLASSES' });
  } catch (err) {
    console.log(
      `There was an error in the redux saga deleting the stack from the server:`,
      err
    );
  }
}

// creates a new stack on the server, and returns its id
function* createStack(action) {
  try {
    const response = yield axios.post('/api/stack');
    // move the view to the edit card stack view with the
    // history that's sent through payload
    yield action.payload.history.push(`/editstack/${response.data.id}`);
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating the stack on the server:`,
      err
    );
  }
}

// updates a specific stack
function* updateStack(action) {
  try {
    // the id is the stack id to be updated; payload.stackName
    yield axios.put(`/api/stack/${action.payload.id}`, {
      stack_name: action.payload.name,
    });
    yield put({ type: 'FETCH_STACK', payload: action.payload });
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating the stack on the server:`,
      err
    );
  }
}

// fetches a single stack from the server
function* fetchStack(action) {
  try {
    // the id is the stack id to be fetched
    const response = yield axios.get(`/api/stack/${action.payload}`);
    yield put({ type: 'SET_EDIT_STACK', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga fetching the stack on the server:`,
      err
    );
  }
}

// returns ALL the cards in a specified stack for teachers
// there is a different saga for fetching only those cards
// that a specific student needs to review for a specific class:
// namely fetchCardsToReview()
function* fetchCards(action) {
  try {
    // the id is the stack id of the cards to be fetched
    const response = yield axios.get(`/api/stack/cards/${action.payload}`);
    yield put({ type: 'SET_CARDS', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga fetching the stack on the server:`,
      err
    );
  }
}

// updates a specific card
function* updateCard(action) {
  try {
    // the id is the id of the card to be updated
    // payload is a card object, shaped as in db
    yield axios.put(`/api/stack/card/${action.payload.id}`, action.payload);
    yield put({ type: 'FETCH_CARDS', payload: action.payload.stack_id });
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating the stack on the server:`,
      err
    );
  }
}

// creates a new card on the server, and returns its id
function* createCard(action) {
  console.log(`in createCard, action.payload = `, action.payload);
  try {
    const response = yield axios.post(
      `/api/stack/card/${action.payload.stack_id}`,
      action.payload
    );
    // refresh the cards
    yield put({ type: 'FETCH_CARDS', payload: action.payload.stack_id });
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating the stack on the server:`,
      err
    );
  }
}

// deletes a specific card on the server
function* deleteCard(action) {
  try {
    // the payload is a card object
    yield axios.delete(`/api/stack/card/${action.payload.id}`);
    // refresh the redux store and the DOM
    yield put({ type: 'FETCH_CARDS', payload: action.payload.stack_id });
  } catch (err) {
    console.log(
      `There was an error in the redux saga deleting the card from the server:`,
      err
    );
  }
}

// returns all the cards that a student needs to review for a specific class
function* fetchCardsToReview(action) {
  try {
    // the expected payload is id of the class that the student is currently reviewing
    const response = yield axios.get(`/api/student/cards/${action.payload}`);
    yield put({ type: 'SET_CARDS_TO_REVIEW', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga fetching the cards to review from the server:`,
      err
    );
  }
}

// updates the familiarity of a specific card
function* updateCardFamiliarity(action) {
  try {
    // the payload carried is an object
    // containing the student_class_card_id for this card
    // and the new familiarity
    console.log('in updateCArdFamil, payload = ', action.payload);
    yield axios.put(`/api/student/cards/${action.payload.id}`, {
      familiarity: action.payload.familiarity,
    });
  } catch (err) {
    console.log(
      `There was an error updating the familiarity of the card for the specific student in the redux saga:`,
      err
    );
  }
}

// returns all the cards that a student needs to review for a specific class
// and then stores that in a reducer
function* fetchEnrolledCardsToReview(action) {
  try {
    // the expected payload is id of the class that the student is enrolled in
    const response = yield axios.get(`/api/student/cards/${action.payload}`);
    // we're only interested in the number of cards overdue, which is the length of
    // the returned array
    // the action.payload is the class id
    yield put({
      type: 'SET_ENROLLED_CARDS_TO_REVIEW',
      payload: { class_id: action.payload, count: response.data.length },
    });
  } catch (err) {
    console.log(
      `There was an error in the redux saga fetching the cards to review from the server:`,
      err
    );
  }
}

// fetches the number of total cards that has been made available to the student
// for a specific class (in the student_class_card table)
function* fetchTotalNumCards(action) {
  try {
    // the expected payload is id of the class that the student is enrolled in
    const response = yield axios.get(
      `/api/student/total/cards/${action.payload}`
    );
    // we're returning a single number
    yield put({
      type: 'SET_TOTAL_NUM_CARDS',
      payload: response.data,
    });
  } catch (err) {
    console.log(
      `There was an error fetching the total number of cards for this student in this class from the server:`,
      err
    );
  }
}

function* stackSaga() {
  yield takeLatest('FETCH_STACKS', fetchStacks);
  yield takeLatest('DELETE_STACK', deleteStack);
  yield takeLatest('CREATE_STACK', createStack);
  yield takeLatest('UPDATE_STACK', updateStack);
  yield takeLatest('FETCH_STACK', fetchStack);
  yield takeLatest('FETCH_CARDS', fetchCards);
  yield takeLatest('UPDATE_CARD', updateCard);
  yield takeLatest('CREATE_CARD', createCard);
  yield takeLatest('DELETE_CARD', deleteCard);
  yield takeLatest('FETCH_CARDS_TO_REVIEW', fetchCardsToReview);
  yield takeLatest('UPDATE_CARD_FAMILIARITY', updateCardFamiliarity);
  yield takeEvery('FETCH_ENROLLED_CARDS_TO_REVIEW', fetchEnrolledCardsToReview);
  yield takeEvery('FETCH_TOTAL_NUM_CARDS', fetchTotalNumCards);
}

export default stackSaga;

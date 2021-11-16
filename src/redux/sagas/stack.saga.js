import { put, takeLatest } from 'redux-saga/effects';
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
    yield put({ type: 'GET_STACKS' });
    yield put({ type: 'GET_CLASSES' });
  } catch (err) {
    console.log(
      `There was an error in the redux saga deleting the stack from the server:`,
      err
    );
  }
}

// creates a new stack on the server, and returns it's id
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
    yield put({ type: 'FETCH_CARDS', payload: action.payload });
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating the stack on the server:`,
      err
    );
  }
}

function* stackSaga() {
  yield takeLatest('GET_STACKS', fetchStacks);
  yield takeLatest('DELETE_STACK', deleteStack);
  yield takeLatest('CREATE_STACK', createStack);
  yield takeLatest('UPDATE_STACK', updateStack);
  yield takeLatest('FETCH_STACK', fetchStack);
  yield takeLatest('FETCH_CARDS', fetchCards);
  yield takeLatest('UPDATE_CARD', updateCard);
}

export default stackSaga;

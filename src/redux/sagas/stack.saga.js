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

function* stackSaga() {
  yield takeLatest('GET_STACKS', fetchStacks);
  yield takeLatest('DELETE_STACK', deleteStack);
}

export default stackSaga;

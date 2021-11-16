import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// fetches classes belonging to the logged in teacher from the server
function* fetchClasses(action) {
  try {
    const response = yield axios.get('/api/class');
    yield put({ type: 'SET_CLASSES', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga retrieving the classes from the server:`,
      err
    );
  }
}

// deletes a specific class on the server belonging to the logged in teacher
function* deleteClass(action) {
  try {
    yield axios.delete(`/api/class/${action.payload}`);
    // refresh the redux store and the DOM
    yield put({ type: 'GET_CLASSES' });
  } catch (err) {
    console.log(
      `There was an error in the redux saga deleting the class from the server:`,
      err
    );
  }
}

// creates a new stack on the server, and returns its id
function* createClass(action) {
  try {
    const response = yield axios.post('/api/class');
    // move the view to the edit card stack view with the
    // history that's sent through payload
    yield action.payload.history.push(`/editclass/${response.data.id}`);
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating the class on the server:`,
      err
    );
  }
}

// fetches a single class from the server
function* fetchClass(action) {
  try {
    // the id is the class id to be fetched
    const response = yield axios.get(`/api/class/${action.payload}`);
    yield put({ type: 'SET_EDIT_CLASS', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga fetching the class on the server:`,
      err
    );
  }
}

function* classSaga() {
  yield takeLatest('GET_CLASSES', fetchClasses);
  yield takeLatest('DELETE_CLASS', deleteClass);
  yield takeLatest('CREATE_CLASS', createClass);
  yield takeLatest('FETCH_CLASS', fetchClass);
}

export default classSaga;

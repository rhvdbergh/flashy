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

function* classSaga() {
  yield takeLatest('GET_CLASSES', fetchClasses);
  yield takeLatest('DELETE_CLASS', deleteClass);
}

export default classSaga;

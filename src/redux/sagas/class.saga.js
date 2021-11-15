import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

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

function* classSaga() {
  yield takeLatest('GET_CLASSES', fetchClasses);
}

export default classSaga;

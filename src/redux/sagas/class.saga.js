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
    yield put({ type: 'FETCH_CLASSES' });
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
    // the payload is the class id to be fetched
    const response = yield axios.get(`/api/class/${action.payload}`);
    yield put({ type: 'SET_EDIT_CLASS', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga fetching the class on the server:`,
      err
    );
  }
}

// updates a specific class
function* updateClass(action) {
  try {
    // the id is the class id to be updated;
    yield axios.put(`/api/class/${action.payload.id}`, action.payload);
    yield put({ type: 'FETCH_CLASS', payload: action.payload.id });
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating the stack on the server:`,
      err
    );
  }
}

// fetches all the available classes
function* fetchAvailableClasses(action) {
  try {
    const response = yield axios.get('/api/student/classes/available');
    yield put({ type: 'SET_AVAILABLE_CLASSES', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga fetching the available classes from the server:`,
      err
    );
  }
}

// adds a specific class to a student's class list
// (making that student part of that class)
function* addClassForStudent(action) {
  try {
    // the expected payload here is the class id that we need to add
    yield axios.post(`/api/student/addclass/${action.payload}`);
    // now refresh the list of classes that the student is enrolled in
    yield put({ type: 'FETCH_ENROLLED_CLASSES' });
  } catch (err) {
    console.log(
      `There was an error in the redux saga adding the class to the student's list on the server:`,
      err
    );
  }
}

// fetches all the classes the current student is already enrolled in
function* fetchEnrolledClasses(action) {
  try {
    // the expected payload here is the class id that we need to add
    const response = yield axios.get(`/api/student/classes/enrolled`);
    // update the redux store
    yield put({ type: 'SET_ENROLLED_CLASSES', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga getting the classes that the student is enrolled in:`,
      err
    );
  }
}

// fetches the progress stats for a specific class
function* fetchClassProgress(action) {
  try {
    // the expected payload here is the class id for which we want the progress
    const response = yield axios.get(`/api/class/progress/${action.payload}`);
    // update the redux store
    yield put({ type: 'SET_CLASS_PROGRESS', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga getting the class progress:`,
      err
    );
  }
}

// fetches the progress stats for a specific class
function* fetchStudentProgress(action) {
  try {
    // the expected payload here is the student_class_id
    const response = yield axios.get(`/api/student/progress/${action.payload}`);
    // update the redux store
    yield put({ type: 'SET_STUDENT_PROGRESS', payload: response.data });
  } catch (err) {
    console.log(
      `There was an error in the redux saga getting the student's progress:`,
      err
    );
  }
}

// creates entirely new batch release dates for a class
function* createReleaseBatches(action) {
  try {
    // the expected payload here is includes a key with the class id
    yield axios.post(
      `/api/class/batch_release/${action.payload.class_id}`,
      action.payload.batches
    );
    // update the redux store by calling a saga
    yield put({
      type: 'FETCH_RELEASE_BATCHES',
      payload: action.payload.class_id,
    });
  } catch (err) {
    console.log(
      `There was an error in the redux saga creating batch release dates for the class:`,
      err
    );
  }
}

// fetches the release dates for specific batches in a stack in a class
function* fetchReleaseBatchDates(action) {
  try {
    // the expected payload here is the student_class_id
    const response = yield axios.get(
      `/api/class/batch_release/${action.payload}`
    );
    // update the redux store
    yield put({ type: 'SET_RELEASE_BATCHES', payload: response.data });
  } catch (err) {
    console.log(`There was an error fetching the batches in this class:`, err);
  }
}

// deletes the release dates for specific batches in a stack in a class
function* deleteReleaseBatchDates(action) {
  try {
    // the expected payload here is the student_class_id
    yield axios.delete(`/api/class/batch_release/${action.payload}`);
    // update the redux store with an empty array
    yield put({ type: 'SET_RELEASE_BATCHES', payload: [] });
  } catch (err) {
    console.log(`There was an error fetching the batches in this class:`, err);
  }
}

// updates the release date a for specific batch in a stack in a class
function* updateReleaseBatchDate(action) {
  try {
    // the expected payload here is the student_class_id
    yield axios.put(
      `/api/class/batch_release/${action.payload.batch_release_date_id}`,
      action.payload
    );
    // update the redux store with an empty array
    yield put({
      type: 'FETCH_RELEASE_BATCHES',
      payload: action.payload.class_id,
    });
  } catch (err) {
    console.log(
      `There was an error updating the batch release date in this class:`,
      err
    );
  }
}

function* classSaga() {
  yield takeLatest('FETCH_CLASSES', fetchClasses);
  yield takeLatest('DELETE_CLASS', deleteClass);
  yield takeLatest('CREATE_CLASS', createClass);
  yield takeLatest('FETCH_CLASS', fetchClass);
  yield takeLatest('UPDATE_CLASS', updateClass);
  yield takeLatest('FETCH_AVAILABLE_CLASSES', fetchAvailableClasses);
  yield takeLatest('ADD_CLASS_FOR_STUDENT', addClassForStudent);
  yield takeLatest('FETCH_ENROLLED_CLASSES', fetchEnrolledClasses);
  yield takeLatest('FETCH_CLASS_PROGRESS', fetchClassProgress);
  yield takeLatest('FETCH_STUDENT_PROGRESS', fetchStudentProgress);
  yield takeLatest('CREATE_RELEASE_BATCHES', createReleaseBatches);
  yield takeLatest('FETCH_RELEASE_BATCHES', fetchReleaseBatchDates);
  yield takeLatest('DELETE_RELEASE_BATCHES', deleteReleaseBatchDates);
  yield takeLatest('UPDATE_RELEASE_BATCH', updateReleaseBatchDate);
}

export default classSaga;

// this component is a main view
// teachers can add or edit classes on this screen

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// import custom components
import BatchReleaseRow from '../BatchReleaseRow/BatchReleaseRow';

//import mui
import {
  Box,
  Button,
  Container,
  Checkbox,
  TextField,
  FormControl,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  RadioGroup,
  Typography,
  Radio,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// set up the mui styles
const useStyles = makeStyles(() => ({
  container: {
    marginTop: '150px',
    paddingBottom: '30px',
  },
  textfield: {
    width: '250px',
  },
  select: {
    width: '250px',
  },
  checkbox: {
    alignSelf: 'center',
  },
  spacing: {
    margin: '40px',
  },
}));

function TeacherEditClass() {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up local state to track inputs
  const [clName, setClName] = useState('');
  const [assignedStack, setAssignedStack] = useState(null);
  const [learnTime, setLearnTime] = useState(30);
  const [totalTime, setTotalTime] = useState(360);
  const [releaseAtOnce, setReleaseAtOnce] = useState(true);

  // draw in the mui styles
  const { container, textfield, select, checkbox, spacing } = useStyles();

  // get the class_id with the useParams hook
  const { class_id } = useParams();

  // get the class being edited from the redux store
  const editClass = useSelector((store) => store.classStore.editClass);
  // get the stacks belonging to this teacher from the redux store
  const stacks = useSelector((store) => store.stackStore.stacks);
  // get the release batch dates from the redux store
  const releaseBatchDates = useSelector(
    (store) => store.classStore.releaseBatchDates
  );

  // on page load, set nav bar title and do the following
  useEffect(() => {
    // set the nav bar title
    dispatch({ type: 'SET_NAV_TITLE', payload: 'Editing Class' });
    // ensure that the back button is displayd on this page
    dispatch({ type: 'SET_DISPLAY_BACK_BUTTON', payload: true });
    // get the current stack that's being edited
    dispatch({ type: 'FETCH_CLASS', payload: class_id });
    // get all the cards in this stack
    dispatch({ type: 'FETCH_STACKS' });
    // get all the batch release dates, if there are any
    dispatch({ type: 'FETCH_RELEASE_BATCHES', payload: class_id });
  }, []);

  // every time the class name changes, do a dispatch to set the nav title
  useEffect(() => {
    dispatch({
      type: 'SET_NAV_TITLE',
      payload: `Editing Class${clName !== '' ? ': ' + clName : ''}`,
    });
  }, [clName]);

  useEffect(() => {
    // set the class name to the name of the class in the redux store
    setClName(editClass.class_name);
    setAssignedStack(editClass.stack_id);
    setTotalTime(editClass.total_time);
    setLearnTime(editClass.initial_time);
    setReleaseAtOnce(editClass.release_at_once);
  }, [editClass]);

  // handles the radio button change for selecting whether
  // cards should be released in batches or not
  const handleReleaseChange = (event) => {
    console.log(event.target.value);
    switch (event.target.value) {
      case 'release_at_once':
        dispatch({
          type: 'UPDATE_CLASS',
          payload: { ...editClass, release_at_once: true },
        });
        // erase the previously set release batches, if applicable
        dispatch({
          type: 'DELETE_RELEASE_BATCHES',
          payload: class_id,
        });
        break;
      case 'release_in_batches':
        dispatch({
          type: 'UPDATE_CLASS',
          payload: { ...editClass, release_at_once: false },
        });
        // the array here mirrors what batch_release_date will
        // look like on the server, minus the date
        dispatch({
          type: 'CREATE_RELEASE_BATCHES',
          payload: {
            class_id: class_id,
            batches: [...editClass.batches_in_stack],
          },
        });
        break;
      default:
        dispatch({
          type: 'UPDATE_CLASS',
          payload: { ...editClass, release_at_once: true },
        });
        break;
    }
  };

  return (
    <Container className={container}>
      {/* Section for general class settings like name and stack */}
      <Paper
        elevation={4}
        sx={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Box className={spacing}>
          <FormControl className={textfield}>
            <TextField
              type="text"
              label="Class Name"
              required
              value={clName}
              onChange={(event) => {
                setClName(event.target.value);
              }}
              // this will select the text in the name box when selected
              onFocus={(event) => {
                event.currentTarget.select();
              }}
              // this will send a dispatch whenever the TextField loses focus
              onBlur={() => {
                // if the clName is empty, we do not want to update the name
                clName !== '' &&
                  dispatch({
                    type: 'UPDATE_CLASS',
                    payload: { ...editClass, class_name: clName },
                  });
              }}
            />
          </FormControl>
        </Box>
        <Box className={spacing}>
          <FormControl>
            <InputLabel id="select-card-stack">Select Card Stack</InputLabel>
            <Select
              labelId="select-card-stack"
              label="Select Card Stack"
              value={editClass.stack_id}
              className={select}
              onChange={(event) => {
                setAssignedStack(event.target.value);
                dispatch({
                  type: 'UPDATE_CLASS',
                  payload: {
                    ...editClass,
                    stack_id: event.target.value,
                    release_at_once:
                      event.target.value === null
                        ? null
                        : editClass.release_at_once,
                  },
                });
              }}
              onBlur={() => {
                dispatch({
                  type: 'UPDATE_CLASS',
                  payload: { ...editClass, stack_id: assignedStack },
                });
              }}
            >
              <MenuItem value={null}>No Assigned Stack</MenuItem>
              {stacks.map((stack) => (
                <MenuItem key={stack.id} value={stack.id}>
                  {stack.stack_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      {/* Section for batch control */}
      <Paper elevation={4}>
        <Box className={spacing}>
          <FormControl>
            <RadioGroup
              aria-label="release"
              defaultValue="release_at_once"
              name="batch-release-control"
              onChange={handleReleaseChange}
            >
              <FormControlLabel
                value="release_at_once"
                control={<Radio />}
                checked={
                  assignedStack === null ? true : releaseAtOnce ? true : false
                }
                disabled={assignedStack === null ? true : false}
                label="Release all cards at once."
              />
              <FormControlLabel
                value="release_in_batches"
                control={<Radio />}
                checked={
                  assignedStack === null ? false : !releaseAtOnce ? true : false
                }
                disabled={assignedStack === null ? true : false}
                label="Release cards in specified batches."
              />
            </RadioGroup>
          </FormControl>
        </Box>
        {!releaseAtOnce &&
          editClass.batches_in_stack &&
          assignedStack &&
          releaseBatchDates.length > 0 && (
            <Box>
              <FormControl>
                {editClass.batches_in_stack.map((batch, index) => {
                  return (
                    <BatchReleaseRow
                      key={index}
                      batch={batch}
                      class_id={class_id}
                      releaseBatchDates={releaseBatchDates}
                    />
                  );
                })}
              </FormControl>
            </Box>
          )}
      </Paper>
      {/* Section for timer settings */}
      <Paper elevation={4}>
        <Box className={spacing} sx={{ display: 'flex' }}>
          <Box className={spacing}>
            <FormControl>
              <TextField
                type="text"
                label="Total Time in Session (seconds)"
                size="small"
                value={totalTime}
                onChange={(event) => {
                  setTotalTime(event.target.value);
                }}
                // this will select the text in the name box when selected
                onFocus={(event) => {
                  event.currentTarget.select();
                }}
                // this will send a dispatch whenever the TextField loses focus
                onBlur={() => {
                  // if the clName is empty, we do not want to update the name
                  totalTime !== '' &&
                    dispatch({
                      type: 'UPDATE_CLASS',
                      payload: { ...editClass, total_time: Number(totalTime) },
                    });
                }}
              />
            </FormControl>
          </Box>
          <Box className={spacing}>
            <FormControl>
              <TextField
                type="text"
                label="Time to Learn Cards (seconds)"
                size="small"
                value={learnTime}
                onChange={(event) => {
                  setLearnTime(event.target.value);
                }}
                // this will select the text in the name box when selected
                onFocus={(event) => {
                  event.currentTarget.select();
                }}
                // this will send a dispatch whenever the TextField loses focus
                onBlur={() => {
                  // if the clName is empty, we do not want to update the name
                  learnTime !== '' &&
                    dispatch({
                      type: 'UPDATE_CLASS',
                      payload: {
                        ...editClass,
                        initial_time: Number(learnTime),
                      },
                    });
                }}
              />
            </FormControl>
          </Box>
          <Box className={spacing}>
            <Button
              sx={{ height: '40px' }}
              variant="contained"
              onClick={() => {
                dispatch({
                  type: 'UPDATE_CLASS',
                  payload: {
                    ...editClass,
                    total_time: 360,
                    initial_time: 30,
                  },
                });
              }}
            >
              <Typography variant="h6">Reset to Default</Typography>
            </Button>
          </Box>
        </Box>
      </Paper>
      {/* Section for making class available to students */}
      <Paper elevation={4}>
        <Box className={spacing}>
          <FormGroup className={checkbox}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editClass.available_to_students}
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_CLASS',
                      payload: {
                        ...editClass,
                        available_to_students: !editClass.available_to_students,
                      },
                    })
                  }
                />
              }
              label="Make class available to students."
            />
          </FormGroup>
        </Box>
      </Paper>
    </Container>
  );
}

export default TeacherEditClass;

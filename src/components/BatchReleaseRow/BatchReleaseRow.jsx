//import mui
import { Typography, TextField, Box } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

function BatchReleaseRow({ batch, releaseBatchDates, class_id }) {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set local state for the date
  // we're using the date for this batch number in the releaseBatchDates array
  // there will be only one match, so we can use index 0 and grab that release date
  const [date, setDate] = useState(
    releaseBatchDates.filter((b) => b.batch_num === batch)[0].release_date
  );
  // grab this batch's id in the
  const [batch_release_date_id, setBatch_release_date_id] = useState(
    releaseBatchDates.filter((b) => b.batch_num === batch)[0].id
  );

  console.log(`releaseBatchDates`, releaseBatchDates, '; batch number', batch);
  console.log(
    'filter',
    releaseBatchDates.filter((b) => b.batch_num === batch)
  );

  const handleChange = (newDate) => {
    console.log('things changed', newDate);
    setDate(newDate);
    // also change the date on the db
    dispatch({
      type: 'UPDATE_RELEASE_BATCH',
      payload: { batch_release_date_id, newDate, class_id },
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        alignContent: 'center',
        ml: '200px',
        mb: '20px',
      }}
    >
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/dd/yyyy"
          value={date}
          onChange={handleChange}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
      </LocalizationProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" sx={{ ml: '50px' }}>
          Batch {batch}
        </Typography>{' '}
      </Box>
    </Box>
  );
}

export default BatchReleaseRow;

//import mui
import { Typography, TextField } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useState } from 'react';

function BatchReleaseRow({ batch }) {
  // set local state for the date
  const [date, setDate] = useState(new Date());

  const handleChange = (newDate) => {
    console.log('things changed', newDate);
    setDate(newDate);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/dd/yyyy"
          value={date}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Typography variant="body1">Batch {batch}</Typography>{' '}
    </>
  );
}

export default BatchReleaseRow;

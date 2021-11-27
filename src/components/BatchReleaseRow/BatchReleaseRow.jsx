//import mui
import { Typography, TextField, Box } from '@mui/material';
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

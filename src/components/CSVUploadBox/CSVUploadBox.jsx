// import package to read csv
import { CSVReader } from 'react-papaparse';

//import mui
import { Paper, Button, Typography, Box } from '@mui/material';

function CSVUploadBox({ setOpenModal }) {
  // functions that fire with CSVReader
  const handleOnDrop = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };
  return (
    <Paper sx={{ height: '480px', width: '550px', padding: '50px' }}>
      <Box sx={{ height: '300px', width: '450px' }}>
        <CSVReader
          onDrop={handleOnDrop}
          onError={handleOnError}
          addRemoveButton
          onRemoveFile={handleOnRemoveFile}
        >
          <Typography variant="h5">
            Drop CSV file here or click to upload.
          </Typography>
        </CSVReader>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: '50px',
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button variant="contained">Submit</Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default CSVUploadBox;

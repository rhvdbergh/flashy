import { useState } from 'react';

// import package to read csv
import { CSVReader } from 'react-papaparse';

//import mui
import { Paper, Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';

function CSVUploadBox({ setOpenModal, stack_id }) {
  // set up the dispatch hook
  const dispatch = useDispatch();

  // local state to keep the cards
  const [cards, setCards] = useState([]);

  // functions that fire with CSVReader
  const handleOnDrop = (data) => {
    // build a temporary array of cards with the data
    const tempCards = [];
    for (let datum of data) {
      tempCards.push({ front: datum.data[0], back: datum.data[1] });
    }
    // set the local state
    setCards(tempCards);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };

  // this is cards
  console.log(`this is cards`, cards);

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
            onClick={() => {
              setOpenModal(false);
              // reset the cards state to an empty array
              setCards([]);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch({ type: 'CREATE_CARDS', payload: { cards, stack_id } });
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default CSVUploadBox;

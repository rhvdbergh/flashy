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
  const [displaySubmit, setDisplaySubmit] = useState(false);

  // functions that fire with CSVReader
  const handleFileLoad = (data) => {
    // build a temporary array of cards with the data
    const tempCards = [];
    for (let datum of data) {
      tempCards.push({
        front: datum.data[0],
        back: datum.data[1],
        batch: datum.data[2],
      });
    }
    // set the local state
    setCards(tempCards);
    setDisplaySubmit(true);
  };

  const handleOnError = (err) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data) => {
    // reset the cards to an empty array
    setCards([]);
    setDisplaySubmit(false);
  };

  // this is cards
  console.log(`this is cards`, cards);

  return (
    <Paper
      sx={{
        height: '480px',
        width: '550px',
        padding: '50px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ height: '300px', width: '450px' }}>
        <CSVReader
          onFileLoad={handleFileLoad}
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
              setDisplaySubmit(false);
            }}
          >
            <Typography variant="h6">Cancel</Typography>
          </Button>
          {/* Show different buttons depending on whether a file has been uploaded */}
          {displaySubmit ? (
            <Button
              variant="contained"
              onClick={() => {
                dispatch({
                  type: 'CREATE_CARDS',
                  payload: { cards, stack_id },
                });

                setOpenModal(false);
                setDisplaySubmit(false);
                setCards([]);
              }}
            >
              <Typography variant="h6">Submit</Typography>
            </Button>
          ) : (
            <Button variant="contained" disabled>
              <Typography variant="h6">Submit</Typography>
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

export default CSVUploadBox;

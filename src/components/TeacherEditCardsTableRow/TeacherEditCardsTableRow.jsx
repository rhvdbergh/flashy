// a row in the edit cards table on the edit cards screen
import { useDispatch } from 'react-redux';
import { useState } from 'react';

// import mui
import { TableCell, TableRow, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TeacherEditCardsTableRow({ card }) {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up local state for each cell
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  return (
    <TableRow>
      <TableCell>
        <TextField
          type="text"
          size="small"
          value={front}
          onChange={(event) => {
            setFront(event.target.value);
          }}
          onBlur={() => {
            dispatch({
              type: 'UPDATE_CARD',
              payload: { ...card, front: front },
            });
          }}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="text"
          size="small"
          value={back}
          onChange={(event) => {
            setBack(event.target.value);
          }}
          onBlur={() => {
            dispatch({
              type: 'UPDATE_CARD',
              payload: { ...card, back: back },
            });
          }}
        />
      </TableCell>
      <TableCell align="center">
        <DeleteIcon
          onClick={() => dispatch({ type: 'DELETE_CARD', payload: card.id })}
        />
      </TableCell>
    </TableRow>
  );
}

export default TeacherEditCardsTableRow;

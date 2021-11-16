// a row in the edit cards table on the edit cards screen
import { useDispatch } from 'react-redux';

// import mui
import { TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TeacherEditCardsTableRow({ card }) {
  // set up the redux dispatch
  const dispatch = useDispatch();

  return (
    <TableRow>
      <TableCell>{card.front}</TableCell>
      <TableCell>{card.back}</TableCell>
      <TableCell align="center">
        <DeleteIcon
          onClick={() => dispatch({ type: 'DELETE_CARD', payload: card.id })}
        />
      </TableCell>
    </TableRow>
  );
}

export default TeacherEditCardsTableRow;

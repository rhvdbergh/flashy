// a row in the stack table on the teacher dashboard

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

// import mui
import { TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';

function TeacherStackTableRow({ stack }) {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up the history hook
  const history = useHistory();

  return (
    <TableRow>
      <TableCell>{stack.stack_name}</TableCell>
      <TableCell align="center">
        <DeleteIcon
          color="error"
          onClick={() => dispatch({ type: 'DELETE_STACK', payload: stack.id })}
        />
      </TableCell>
      <TableCell align="center">
        <CreateIcon
          color="primary"
          onClick={() => history.push(`/editstack/${stack.id}`)}
        />
      </TableCell>
    </TableRow>
  );
}

export default TeacherStackTableRow;

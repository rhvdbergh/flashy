// a row in the edit cards table on the edit cards screen
import { useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

// import mui
import { TableCell, TableRow, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function TeacherEditCardsTableRow({ card, stack_id }) {
  // set up the redux dispatch
  const dispatch = useDispatch();

  // set up local state for each cell
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  // this will be used to keep track if a new card was created
  // in this case, the focus must again be on the final input box in the table
  const [recentlyPostedCard, setRecentlyPostedCard] = useState(false);

  // we're monitoring cards so we can trigger the front and back to be
  // empty again
  const cards = useSelector((store) => store.stackStore.cards);

  // set up the useRef hook for the TextField component so
  // we can assign focus to it
  const textFieldElement = useRef(null);

  // when cards changes, it means we have updated a card
  // so we need to clear the input fields in the last row
  useEffect(() => {
    if (card.id === -1) {
      setFront('');
      setBack('');
    }
    if (recentlyPostedCard) {
      // set focus on input box using useRef
      // textFieldElement.current.focus();
      // reset the tracker
      setRecentlyPostedCard(false);
    }
  }, [cards]);

  // update an existing card
  const updateCard = () => {
    dispatch({
      type: 'UPDATE_CARD',
      payload: {
        ...card,
        front: front,
        back: back,
        stack_id: stack_id,
      },
    });
  };

  // create a new card
  const createCard = () => {
    // we only create a new card once both boxes have been filled out
    if (front !== '' && back !== '') {
      dispatch({
        type: 'CREATE_CARD',
        payload: {
          ...card,
          front: front,
          back: back,
          stack_id: stack_id,
        },
      });
      // set the tracker so we know where the focus goes
      setRecentlyPostedCard(true);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <TextField
          ref={textFieldElement}
          type="text"
          size="small"
          value={front}
          onChange={(event) => {
            setFront(event.target.value);
          }}
          onBlur={() => {
            // check if this is an already existing card or not
            // also, only update if both boxes are filled out
            card.id !== -1 && front !== '' && back !== ''
              ? updateCard()
              : createCard();
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
            // check if this is an already existing card or not
            // also, only update if both boxes are filled out
            card.id !== -1 && front !== '' && back !== ''
              ? updateCard()
              : createCard();
          }}
        />
      </TableCell>
      <TableCell align="center">
        {/* only display the delete icon if this is an actual card */}
        {card.id !== -1 && (
          <DeleteIcon
            onClick={() => dispatch({ type: 'DELETE_CARD', payload: card })}
          />
        )}
      </TableCell>
    </TableRow>
  );
}

export default TeacherEditCardsTableRow;

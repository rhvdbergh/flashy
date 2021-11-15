import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

// import mui
import { makeStyles } from '@mui/styles';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Typography,
  Button,
  TextField,
  Checkbox,
} from '@mui/material';

// styling for mui
const useStyles = makeStyles(() => ({
  form: {
    marginTop: '70px',
    marginBottom: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '550px',
    width: '300px',
    textAlign: 'center',
  },
  input: {
    margin: '20px',
    width: '100%',
  },
  checkbox: {
    alignSelf: 'center',
  },
}));

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        role: isTeacher ? 'teacher' : 'student',
      },
    });
  }; // end registerUser

  // set up the mui style
  const { form, input, checkbox } = useStyles();

  return (
    <FormControl>
      <form className={form} onSubmit={registerUser}>
        <Typography variant="h3">Register</Typography>
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <TextField
          type="text"
          label="Username"
          size="small"
          required
          className={input}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          type="password"
          label="Password"
          size="small"
          required
          className={input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          type="text"
          label="First Name"
          size="small"
          required
          className={input}
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <TextField
          type="text"
          label="Last Name"
          size="small"
          required
          className={input}
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <FormGroup className={checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isTeacher}
                onClick={() => setIsTeacher(!isTeacher)}
              />
            }
            label="I am a teacher"
          />
        </FormGroup>
        <Button
          variant="contained"
          type="submit"
          name="submit"
          value="Register"
        >
          Register
        </Button>
        <Typography variant="body1">
          {' '}
          Already a user? Click below to log in ...
        </Typography>
        <Button
          variant="contained"
          name="login"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </Button>
      </form>
    </FormControl>
  );
}

export default RegisterForm;

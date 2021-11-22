import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Nav.css';
import { useDispatch, useSelector } from 'react-redux';

//import icons from mui
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

// import responsive hook from mui
import useMediaQuery from '@mui/material/useMediaQuery';
import json2mq from 'json2mq';

// import mui styling
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

// styling for mui
const useStyles = makeStyles(() => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: '25px',
  },
}));

function Nav() {
  const user = useSelector((store) => store.user);
  const navTitle = useSelector((store) => store.utils.navTitle);
  const displayBackButton = useSelector(
    (store) => store.utils.displayBackButton
  );

  // set up redux dispatch
  const dispatch = useDispatch();

  // set up the useHistory hook
  const history = useHistory();

  // set up the styling for mui
  const { toolbar, icon } = useStyles();

  // set up responsive breakpoints for icons
  const matches = useMediaQuery(
    json2mq({
      minWidth: 600,
    })
  );

  return (
    <header className="nav">
      <AppBar>
        <Toolbar className={toolbar}>
          <Link to="/home">
            {/* Adding component="h1" here so screen readers pick up on it, it's the main heading */}
            {matches ? (
              <Typography variant="h4" component="h1" className="nav-title">
                Flashy
              </Typography>
            ) : (
              <HomeIcon className={icon} />
            )}
          </Link>
          <Box>
            <Typography variant="h5" className="nav-title">
              {navTitle}
            </Typography>
          </Box>
          <Box>
            {/* If no user is logged in, show these links */}
            {user.id === undefined && (
              // If there's no user, show login/registration links
              <Button
                key="login"
                color="inherit"
                className="navLink"
                onClick={() => history.push('/login')}
              >
                Login / Register
              </Button>
            )}

            {/* If a user is logged in, show these links */}
            {user.id && matches && (
              <Button
                key="Home"
                color="inherit"
                className="navLink"
                onClick={() => history.push('/home')}
              >
                Home
              </Button>
            )}
            {/* Show the back button if utils.displayBackButton is true */}

            {displayBackButton && matches ? (
              <Button
                className="navLink"
                key="Back"
                color="inherit"
                onClick={() => history.goBack()}
              >
                Back
              </Button>
            ) : (
              displayBackButton && (
                <SettingsBackupRestoreIcon
                  onClick={() => history.goBack()}
                  className={icon}
                />
              )
            )}

            {/* For the moment, there is no about page  */}
            {/* <Button
              className="navLink"
              color="inherit"
              key="About"
              onClick={() => history.push('/about')}
            >
              About
            </Button> */}

            {/* If a user is logged in, show these links */}
            {user.id && matches ? (
              <Button
                className="navLink"
                key="Log Out"
                color="inherit"
                onClick={() => dispatch({ type: 'LOGOUT' })}
              >
                Log Out
              </Button>
            ) : (
              user.id && (
                <LogoutIcon onClick={() => dispatch({ type: 'LOGOUT' })} />
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default Nav;

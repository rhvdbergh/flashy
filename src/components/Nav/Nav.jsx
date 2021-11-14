import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { Box, Typography, ButtonGroup, Button } from '@mui/material';

function Nav() {
  const user = useSelector((store) => store.user);
  const navTitle = useSelector((store) => store.navTitle);

  return (
    <Box className="nav">
      <Link to="/home">
        <Typography variant="h4" className="nav-title">
          Flashy
        </Typography>
      </Link>
      <Box>
        {/* If no user is logged in, show these links */}
        {user.id === null && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Box>
              <Typography variant="h5" className="nav-title">
                {navTitle}
              </Typography>
            </Box>
            <Link className="navLink" to="/user">
              Home
            </Link>

            <Link className="navLink" to="/info">
              Info Page
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}

        <Link className="navLink" to="/about">
          About
        </Link>
      </Box>
    </Box>
  );
}

export default Nav;

import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import ProtectedStudentRoute from '../ProtectedStudentRoute/ProtectedStudentRoute';
import ProtectedTeacherRoute from '../ProtectedTeacherRoute/ProtectedTeacherRoute';

import Nav from '../Nav/Nav';
import AboutPage from '../AboutPage/AboutPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import StudentDashboard from '../StudentDashboard/StudentDashboard';
import TeacherDashboard from '../TeacherDashboard/TeacherDashboard';
import TeacherEditClass from '../TeacherEditClass/TeacherEditClass';
import TeacherEditCards from '../TeacherEditCards/TeacherEditCards';
import TeacherClassProgress from '../TeacherClassProgress/TeacherClassProgress';
import TeacherProgressDetails from '../TeacherProgressDetails/TeacherProgressDetails';
import StudentReviewCards from '../StudentReviewCards/StudentReviewCards';
import StudentReviewStats from '../StudentReviewStats/StudentReviewStats';
import StudentClassStats from '../StudentClassStats/StudentClassStats';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: '#03a9f4',
    },
    white: {
      main: '#f2f2f2',
    },
  },
});

import './App.css';

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  console.log(user);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />

            {/* Visiting localhost:3000/about will show the about page. */}
            <Route
              // shows AboutPage at all times (logged in or not)
              exact
              path="/about"
            >
              <AboutPage />
            </Route>

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
            <ProtectedRoute
              // logged in shows UserPage else shows LoginPage
              exact
              path="/user"
            >
              {/* Depending on the user's role, the "home" page = dashboard differs */}
              {user.role === 'student' ? (
                <StudentDashboard />
              ) : (
                <TeacherDashboard />
              )}
            </ProtectedRoute>

            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/info"
            >
              <InfoPage />
            </ProtectedRoute>

            <Route exact path="/login">
              {user.id ? (
                // If the user is already logged in,
                // redirect to the /user page
                <Redirect to="/user" />
              ) : (
                // Otherwise, show the login page
                <LoginPage />
              )}
            </Route>

            <Route exact path="/registration">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/user" />
              ) : (
                // Otherwise, show the registration page
                <RegisterPage />
              )}
            </Route>

            <Route exact path="/home">
              {user.id ? (
                // If the user is already logged in,
                // redirect them to the /user page
                <Redirect to="/user" />
              ) : (
                // Otherwise, show the Landing page
                <LandingPage />
              )}
            </Route>

            <ProtectedTeacherRoute
              // logged in edit class page else shows login
              exact
              path="/editclass/:class_id"
            >
              <TeacherEditClass />
            </ProtectedTeacherRoute>

            <ProtectedTeacherRoute exact path="/class/progress/:class_id">
              <TeacherClassProgress />
            </ProtectedTeacherRoute>

            <ProtectedTeacherRoute
              exact
              path="/class/progress/details/:student_class_id"
            >
              <TeacherProgressDetails />
            </ProtectedTeacherRoute>

            <ProtectedTeacherRoute
              // logged in edit stack page else shows login
              path="/editstack/:stack_id"
            >
              <TeacherEditCards />
            </ProtectedTeacherRoute>

            <ProtectedStudentRoute
              // logged in learn cards screen
              exact
              path="/cards/:class_id"
            >
              <StudentReviewCards />
            </ProtectedStudentRoute>

            <ProtectedStudentRoute exact path="/reviewstats/:class_id">
              <StudentReviewStats />
            </ProtectedStudentRoute>

            <ProtectedStudentRoute exact path="/class/stats/:class_id">
              <StudentClassStats />
            </ProtectedStudentRoute>

            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

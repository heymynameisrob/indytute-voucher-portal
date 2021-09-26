import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useData } from './context/DataProvider';
import {LoginPage} from './components/Login';
import {DashboardPage} from './components/Dashboard';
import { Redirect } from 'react-router';

const App = () => {
  const [authed, setAuthed] = useState(false);
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if(user) {
      console.log('Logged In')
      setAuthed(true)
    } else {
      console.log('Not Logged In')
      setAuthed(false)
    }
  });

  return authed ? <DashboardPage /> : <LoginPage />
}
export default App
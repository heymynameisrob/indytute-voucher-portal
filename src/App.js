import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {LoginPage} from './components/Login';
import createRoutes from './routes';

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

  return authed ? createRoutes() : <LoginPage />
}
export default App
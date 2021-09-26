import React, {useRef} from 'react';
import { useData } from '../context/DataProvider';
import {TextInput, Button} from './Controls';
import { DangerAlert } from './Notifications';

export const LoginPage = () => {

  return(
    <div class="max-w-xl mx-auto">
      <h2 class="text-lg lg:text-2xl font-semibold text-center py-6">Indytute Voucher Portal</h2>
      <LoginForm />
    </div>
  )
}

const LoginForm = (props) => {
  const {loginWithFirebase, user} = useData();
  const loginFormRef = useRef(null);  

  const handleLogin = () => {
    const form = loginFormRef.current;
    const email = form['Email'].value;
    const password = form['Password'].value;

    console.log('Logging in...')  
    loginWithFirebase(email, password);
  }

  return(
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="space-y-4">        
        <form ref={loginFormRef}>
          <TextInput type="email" name="Email" />
          <TextInput type="password" name="Password" />        
        </form>
        <Button onClick={() => handleLogin()}>Login</Button>  
        {user.status === 'INVALID' ? <DangerAlert>That email address or password doesn't look right. Try again.</DangerAlert> : null}            
      </div>
    </div>
  )
}


import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore"
import { modifyPDF } from '../components/PDF';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzZUEBIPB2nDz9WGXepfPzvTvgSMAZOoM",
  authDomain: "indytute-voucher-print.firebaseapp.com",
  projectId: "indytute-voucher-print",
  storageBucket: "indytute-voucher-print.appspot.com",
  messagingSenderId: "654106251926",
  appId: "1:654106251926:web:43ff995e0423e6cfbae8b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const DataContext = React.createContext();

const DataProvider = (props) => {
  const auth = getAuth();
  const [orders,setOrders] = useState([]);  
  const [completedOrders,setCompletedOrders] = useState([]);  
  const [user, setUser] = useState({status:'NOT LOGGED IN', user:{}});

  const loginWithFirebase = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(creds => setUser({status:'LOGGED IN', user: creds.user}))
    .catch(err => setUser({status:'INVALID', message:err.message}))
  }
  
  const logoutWithFirebase = () => {
    const auth = getAuth();
    auth.signOut()
  }

  const getOrders = async() => {
    const arry = [];
    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach((doc) => {            
      arry.push({id: doc.id, data:doc.data()});      
    });  
    const completedOrders = arry.filter(order => order.data.complete === true);
    const incompletedOrders = arry.filter(order => order.data.complete !== true);

    setOrders(incompletedOrders);     
    setCompletedOrders(completedOrders)

  }

  const setComplete = async (id, newState) => {
    const cityRef = doc(db, 'orders', id);
    setDoc(cityRef, { complete: newState }, { merge: true });
    const fetch = await getOrders();        
  }
  

  return(
    <DataContext.Provider value={{ user, loginWithFirebase, logoutWithFirebase, setComplete, getOrders, orders, completedOrders }} {...props} />
  )
}

const useData = () => React.useContext(DataContext)

export { DataProvider, useData }
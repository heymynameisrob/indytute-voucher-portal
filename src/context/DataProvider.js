import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, query, setDoc, limit, orderBy } from "firebase/firestore"
import { getStorage, ref, uploadBytes, listAll, deleteObject } from "firebase/storage";

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

  const [isFetching, setIsFetching] = useState(true);
  const [orders,setOrders] = useState([]);  
  const [completedOrders,setCompletedOrders] = useState([]);  
  const [user, setUser] = useState({status:'NOT LOGGED IN', user:{}});
  const [fileUploaded, setFileUploaded] = useState({success:false});  
  const [vouchers, setVouchers] = useState([]);  
  const [removedThisVoucher, setRemovedThisVoucher] = useState(false);

  const archivedOrderLimit = 100;

  const loginWithFirebase = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(creds => setUser({status:'LOGGED IN', user: creds.user}))
    .catch(err => setUser({status:'INVALID', message:err.message}))
  }

  const getAuthState = () => {
    auth && setUser({status:'LOGGED IN', user:auth.currentUser})
  }
  
  const logoutWithFirebase = () => {
    const auth = getAuth();
    auth.signOut()
  }

  const getOrders = async() => {
    console.log('Getting new orders...')
    const arry = [];
    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach((doc) => {            
      arry.push({id: doc.id, data:doc.data()});            
    });      

    const sortedArray = arry.sort((a,b) => new Date(b.data.created) - new Date(a.data.created));
    const incompletedOrders = sortedArray.filter(order => order.data.complete !== true);

    setOrders(incompletedOrders);         
    setIsFetching(false)    
  }

  const getCompletedOrders = async() => {
    console.log('Getting old orders...')
    const arry = [];
    const querySnapshot = await getDocs(query(collection(db, "orders"), orderBy('created', 'desc'), limit(archivedOrderLimit)));
    querySnapshot.forEach((doc) => {            
      arry.push({id: doc.id, data:doc.data()});            
    });      

    const completedOrders = arry.filter(order => order.data.complete === true);    
    
    setCompletedOrders(completedOrders)
    setIsFetching(false)    
  }

  const setComplete = async (id, newState) => {

    const completingLatestOrder = newState;

    // Updates Firebase
    const cityRef = doc(db, 'orders', id);

    try {
      setDoc(cityRef, { complete: newState }, { merge: true });
    } catch {
      alert('Woops. Something went wrong. Try again and if it persists, contact Rob')
    }
    
    // Update Local State
    const newOrdersState = orders.filter(function( obj ) {
      return obj.id !== id;
    });

    // Checks if order is going from latest to completed
    completingLatestOrder ? setOrders(newOrdersState) : setCompletedOrders(newOrdersState);
    
  }

  const uploadFile = async(sku, file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `${sku}.pdf`);
        
    return uploadBytes(storageRef, file)
    .then(() => {
      console.log('Uploaded file:' + file.name + 'as' + sku )     
      setFileUploaded({success: true})           
    })    
    .catch(err => { setFileUploaded({success: false, status: err.message})})
  }

  const listFiles = async() => {
    const storage = getStorage();
    const listRef = ref(storage, `/`);    
    const arry = [];

    listAll(listRef)
    .then((res)=> {
      res.items.forEach((itemRef) => {        
        const {name} = itemRef;
        arry.push({name})                
      });
    })
    .catch(err => console.log(err))  

    setVouchers(arry)          
  }

  const removeFile = async(pdf) => {
    const storage = getStorage();
    const fileRef = ref(storage, `/${pdf}`); 

    setRemovedThisVoucher(pdf);

    return deleteObject(fileRef)
    .then(() => setRemovedThisVoucher(true))
    .catch(err => console.log(err))
  }

  const voucherRefresh = async (id) => {    
    const cityRef = doc(db, 'orders', id);
    setDoc(cityRef, { voucherExists: true }, { merge: true });              
  }

  return(
    <DataContext.Provider value={{ user, getAuthState, loginWithFirebase, logoutWithFirebase, isFetching, setComplete, getOrders, getCompletedOrders, orders, completedOrders, fileUploaded, uploadFile, voucherRefresh, listFiles, vouchers, removeFile, removedThisVoucher}} {...props} />
  )
}

const useData = () => React.useContext(DataContext)

export { DataProvider, useData }
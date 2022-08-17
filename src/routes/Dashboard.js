import React, {Suspense, useEffect, useState} from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useData } from '../context/DataProvider';
import { PageContainer, PageHeader, DashboardNav } from '../components/Layout';
import { ButtonSecondary, IconButton } from '../components/Controls';
import { DashTable } from '../components/Table';


export const DashboardPage = () => {
  const {getOrders, getCompletedOrders, completedOrders, orders, logoutWithFirebase, isFetching, getAuthState} = useData();    
  const [showArchive, setShowArchive] = useState(false);

  useEffect(async () => {    
    getAuthState();
    await getOrders();              
    await getCompletedOrders();              
  }, []);


  return(
    <PageContainer>
      <DashboardNav />
      <PageHeader label="Latest Orders" orders={orders} />      

      {isFetching ? <div>Loading...</div> : <DashboardTable key={orders.length} data={orders} />}

      <div class="flex justify-between items-center mb-6 mt-12">
        <PageHeader label="Archived Orders" orders={completedOrders} />      
        <IconButton onClick={() => setShowArchive(!showArchive)}>{ showArchive ? <ChevronUp color="currentColor" /> : <ChevronDown color="currentColor" /> }</IconButton>
      </div>

      {showArchive ? <DashboardTable data={completedOrders} /> : null}      
      
      <ToastContainer />
      <ButtonSecondary onClick={() => logoutWithFirebase()}>Logout</ButtonSecondary>
    </PageContainer>
  )
}

const DashboardTable = ({data}) => {

  // Check if data is fetched from Firebase
  if(data.length < 1) {
    return <div>No new orders</div>
  }

  return(
    <DashTable cols={['Name, Email']} data={data} />
  )
}
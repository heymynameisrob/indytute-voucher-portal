import React, {useEffect, useState} from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useData } from '../context/DataProvider';
import { ButtonSecondary, IconButton } from './Controls';
import { Table } from './Table';


export const DashboardPage = () => {
  const {getOrders, completedOrders, orders} = useData();    
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {    
    const fetch = async() => {
      await getOrders()            
    }
    fetch();            
  }, []);

  return(
    <PageContainer>
      <DashboardNav />
      <PageHeader label="Latest Orders" orders={orders} />      
      <DashboardTable data={orders} />

      <div class="flex justify-between items-center mb-6 mt-12">
        <PageHeader label="Archived Orders" orders={completedOrders} />      
        <IconButton onClick={() => setShowArchive(!showArchive)}>{ showArchive ? <ChevronUp color="currentColor" /> : <ChevronDown color="currentColor" /> }</IconButton>
      </div>

      {
      showArchive ? 
      <DashboardTable data={completedOrders} /> : null
      }
      <ToastContainer />
    </PageContainer>
  )
}

const PageContainer = ({children}) => (
  <div className="max-w-4xl px-4 mx-auto">
    {children}
  </div>
)

const DashboardNav = () => {
  const {logoutWithFirebase} = useData();
  return(
    <div className="flex justify-between items-center py-6">
      <h2 className="text-lg font-semibold">Indytute</h2>
      <ButtonSecondary onClick={() => logoutWithFirebase()}>Logout</ButtonSecondary>
    </div>
  )
}

const PageHeader = ({label, orders}) => (
  <h2 class="text-2xl md:text-4xl font-semibold mb-6">
    {label}
    <span className="text-xs text-opacity-50 font-normal pl-2">({orders.length} orders)</span>
  </h2>
)

const DashboardTable = ({data}) => {

  // Check if data is fetched from Firebase
  if(data.length < 1) {
    return <div>No orders to show</div>
  }

  return(
    <Table cols={['Name, Email']} data={data} />
  )
}
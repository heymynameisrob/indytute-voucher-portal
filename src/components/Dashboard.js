import React, {useEffect} from 'react';
import { useData } from '../context/DataProvider';
import { Button, ButtonSecondary } from './Controls';
import { Table } from './Table';

export const DashboardPage = () => {
  const {getOrders, orders} = useData();    

  useEffect(() => {    
    const fetch = async() => {
      const res = await getOrders()            
    }
    fetch();            
  }, []);
  
  console.log('Order', orders[0]);

  return(
    <div className="max-w-4xl px-4 mx-auto">
      <DashboardNav />
      <h2 class="text-2xl md:text-4xl font-semibold mb-6">Latest Orders</h2>
      <DashboardTable data={orders} />
    </div>
  )
}

const DashboardNav = () => {
  const {logoutWithFirebase} = useData();
  return(
    <div className="flex justify-between items-center py-6">
      <h2 className="text-lg font-semibold">Indytute</h2>
      <ButtonSecondary onClick={() => logoutWithFirebase()}>Logout</ButtonSecondary>
    </div>
  )
}

const DashboardTable = ({data}) => {

  // Check if data is fetched from Firebase
  if(data.length < 1) {
    return <div>Loading...</div>
  }

  return(
    <Table cols={['Name, Email']} data={data} />
  )
}
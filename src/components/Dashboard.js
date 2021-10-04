import React, {useEffect, useState} from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useData } from '../context/DataProvider';
import { Button, ButtonSecondary, IconButton } from './Controls';
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
    <div className="max-w-4xl px-4 mx-auto">
      <DashboardNav />
      <h2 class="text-2xl md:text-4xl font-semibold mb-6">New Orders <span className="text-xs text-opacity-50 font-normal">({orders.length} orders)</span></h2>
      <DashboardTable data={orders} />

      <div class="flex justify-between items-center mb-6 mt-12">
        <h2 class="text-2xl md:text-4xl font-semibold">Archived Orders <span className="text-xs text-opacity-50 font-normal">({completedOrders.length} orders)</span></h2>
        <IconButton onClick={() => setShowArchive(!showArchive)}>
          { showArchive ? <ChevronUp color="currentColor" /> : <ChevronDown color="currentColor" /> }
        </IconButton>
      </div>
      {showArchive ? <DashboardTable data={completedOrders} /> : null}
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
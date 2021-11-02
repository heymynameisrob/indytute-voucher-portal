import React, {Suspense, useEffect, useState} from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import ReactModal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useData } from '../context/DataProvider';
import { ButtonSecondary, IconButton } from './Controls';
import { Table } from './Table';
import { Upload } from './Upload';


export const DashboardPage = () => {
  const {getOrders, completedOrders, orders, logoutWithFirebase, fileUploaded, getAuthState, user} = useData();    
  const [showArchive, setShowArchive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.6)'
    }
  }

  useEffect(() => {    
    getAuthState();
    
    const fetch = async() => {
      await getOrders()            
    }
    fetch();            
  }, []);

  useEffect(() => {
    console.log('PING!')
    if(fileUploaded.success === true) {
      closeModal()
    }
  },[fileUploaded])

  const openModal = () => {
    setModalIsOpen(true);
  }
  const closeModal = () => {
    setModalIsOpen(false);
  }

  console.log(user);

  return(
    <PageContainer>
      <DashboardNav handleOpenModal={openModal} />
      <PageHeader label="Latest Orders" orders={orders} />      
      <DashboardTable key={user.uid} data={orders} />

      <div class="flex justify-between items-center mb-6 mt-12">
        <PageHeader label="Archived Orders" orders={completedOrders} />      
        <IconButton onClick={() => setShowArchive(!showArchive)}>{ showArchive ? <ChevronUp color="currentColor" /> : <ChevronDown color="currentColor" /> }</IconButton>
      </div>

      {
      showArchive ? 
      <DashboardTable data={completedOrders} /> : null
      }      
      <ToastContainer />
      <ButtonSecondary onClick={() => logoutWithFirebase()}>Logout</ButtonSecondary>
      <Suspense fallback="">
        <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        >
        <Upload />
        </ReactModal>
      </Suspense>
    </PageContainer>
  )
}

const PageContainer = ({children}) => (
  <div className="max-w-6xl px-4 mx-auto">
    {children}
  </div>
)

const DashboardNav = ({handleOpenModal}) => {  
  return(
    <div className="flex justify-between items-center py-6">
      <h2 className="text-lg font-semibold">Indytute</h2>
      <div className="space-x-4">
        <ButtonSecondary onClick={() => handleOpenModal()}>Upload Voucher</ButtonSecondary>        
      </div>
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
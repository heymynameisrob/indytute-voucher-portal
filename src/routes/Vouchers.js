import React, {Suspense, useEffect, useState} from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataProvider';

import { ButtonSecondary, IconButton } from '../components/Controls';
import { VoucherTable } from '../components/Table';
import { Upload } from '../components/Upload';


export const VouchersPage = () => {
  const {getOrders, vouchers, listFiles, logoutWithFirebase, fileUploaded, getAuthState, hydrateOrders} = useData();    
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

  useEffect(async () => {    
    getAuthState();
    await getOrders();              
  }, [fileUploaded]);

  useEffect(() => {    
    if(fileUploaded.success === true) {
      closeModal()      
    }
  },[fileUploaded])

  useEffect(async () => {
    await listFiles();
  },[])

  const openModal = () => {
    setModalIsOpen(true);
  }
  const closeModal = () => {
    setModalIsOpen(false);
  }

  console.log(vouchers);

  return(
    <PageContainer>
      <DashboardNav handleOpenModal={openModal} />
      <PageHeader label="Vouchers" />            
      
      <Table key={vouchers.length} data={vouchers} />
     
      <ButtonSecondary onClick={() => logoutWithFirebase()}>Logout</ButtonSecondary>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        >
        <Upload />
      </ReactModal>
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
      <Link to="/">Back to dashboard</Link>
      <div className="space-x-4">
        <ButtonSecondary onClick={() => handleOpenModal()}>Upload Voucher</ButtonSecondary>        
      </div>
    </div>
  )
}

const PageHeader = ({label}) => (
  <h2 class="text-2xl md:text-4xl font-semibold mb-6">
    {label}    
  </h2>
)

const Table = ({data}) => {

  // Make this better
  if(data.length < 1) {       
    return (
      <div>Loading...</div>
    )
  }

  return(    
    <VoucherTable cols={['Name, Email']} data={data} />
  )
}
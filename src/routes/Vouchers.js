import React, {Suspense, useEffect, useState} from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useData } from '../context/DataProvider';

import { Button, ButtonSecondary } from '../components/Controls';
import { PageContainer, PageHeader } from '../components/Layout';
import { VoucherTable } from '../components/Table';
import { Upload } from '../components/Upload';


export const VouchersPage = () => {
  const {getOrders, vouchers, listFiles, fileUploaded} = useData();      
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [voucherLimit, setVoucherLimit] = useState(8);

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

  const openModal = () => {setModalIsOpen(true) }
  const closeModal = () => { setModalIsOpen(false);}  

  return(
    <PageContainer>
      <VoucherNav handleOpenModal={openModal} />
      <PageHeader label="Vouchers" />            

      <VoucherList data={vouchers} limit={voucherLimit}/>

      {vouchers.length > voucherLimit && <ButtonSecondary onClick={() => setVoucherLimit(voucherLimit + 20)}>Load more</ButtonSecondary>}
           
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        >
        <Upload />
      </ReactModal>
      <ToastContainer />
    </PageContainer>
  )
}

const VoucherNav = ({handleOpenModal}) => {  
  return(
    <div className="flex justify-between items-center py-6">
      <Link className="font-bold text-purple-700 underline" to="/">Back to dashboard</Link>
      <div className="space-x-4">
        <ButtonSecondary onClick={() => handleOpenModal()}>Upload Voucher</ButtonSecondary>        
      </div>
    </div>
  )
}

const VoucherList = ({data, limit}) => {

  // Make this better
  if(data.length < 1) {       
    return (
      <div>Loading...</div>
    )
  }  

  return (
    <ul class="block space-y-4 mb-6">
      {data.slice(0,limit).map(item => <li><VoucherListItem name={item.name} /></li>)}
    </ul>
  )
}

const VoucherListItem = ({name}) => {

  const {removeFile, removedThisVoucher, listFiles} = useData(); 
  
  const handleRemove = async(pdf) => {    
        
    removeFile(pdf);
    toast.success(`Deleted ${pdf} from database`)

   }

  return(
    <div className="flex justify-between items-center bg-white p-4 border-gray-200">
      <p>{name}</p>
      <a className="font-bold text-red-700 underline" href="#" onClick={() => handleRemove(name)}>Delete voucher permanently</a>
    </div>
  )
}

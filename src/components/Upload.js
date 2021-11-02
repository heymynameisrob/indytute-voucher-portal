import React, {useCallback, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone'
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useData } from '../context/DataProvider';
import { Button } from './Controls';

export const Upload = () => {  
  const [data, setData] = useState();

  return(
    <div className="pb-12 px-8 lg:px-24 space-y-8 modal">
      <header className="grid items-center pb-2 pt-8 text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-900">Upload Missing Voucher</h2>
        <p className="text-sm text-gray-500">PDF only, max 2MB</p>
      </header>
      <ProductSelect handleSetProduct={(option) => setData({sku: option.value, id:option.id})} />
      {data && <FileUpload data={data} />}      
    </div>
    
  )
}

const ProductSelect = ({handleSetProduct}) => {
  const {getOrders, orders} = useData();
  const [options, setOptions] = useState([]);
 
  useEffect(() => {
    getOrders();
    createOptions();
  }, []);

  const createOptions = () => {
    const array = [];
    orders.forEach(order => {
      const {name, sku, voucherExists, voucherURL} = order.data;
      // Replace with voucherExists at some point
      if(!voucherURL || voucherURL.includes('https') === false) {
        array.push({label: name, value: sku, id:order.id})
      }
    });
    console.log(array);
    setOptions(array);
  }

  if(options.length < 1) {
    return <p>Loading...</p>
  }

  return(
    <div className="space-y-2">
      <p className="text-sm text-gray-700">Select the product with a missing voucher</p>
      <Select
        options={options}       
        onChange={(option) => handleSetProduct(option)}
      />
    </div>
  )
}

const FileUpload = ({data}) => {
  const {uploadFile, voucherRefresh, getOrders} = useData();
  const {sku, id} = data;

  const onDrop = useCallback(acceptedFiles => {    
    console.log(`Uploading file: ${sku}.pdf`)
    uploadFile(sku, acceptedFiles[0])
    .then(() => voucherRefresh(id))
    .then(() => toast.success('Uploading'))  
    .catch(() => toast.success('Oops, that didnt work. Refesh and try again.'))
  }, [])


  const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({onDrop})

  const customRootProps = {
    maxSize: 2097152,
    accept: 'application/pdf'
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">Select the product with a missing voucher</p>
      <div className="bg-gray-100 w-full h-64 rounded border-gray-300 border-2 grid items-center p-8" {...getRootProps(customRootProps)}>
        <input {...getInputProps()} />      
        {isDragActive && !isDragReject && <p className="text-sm text-gray-700 font-semibold">Drop the files here ...</p>}
        {!isDragActive && <p className="text-sm text-gray-700 max-w-prose">Drag your PDF file here or click to upload </p>}
        {isDragReject && <p className="text-sm text-gray-700 max-w-prose">That's not a PDF mate</p>}
      </div>
    </div>
   
  )
  
}
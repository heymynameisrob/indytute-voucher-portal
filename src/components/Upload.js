import React, {useCallback, useState, useEffect} from 'react';
import {useDropzone} from 'react-dropzone'
import { File } from 'react-feather';
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
  const {uploadFile, voucherRefresh} = useData();
  const {acceptedFiles, getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept} = useDropzone()  
  const {sku, id} = data;
  
  const files = acceptedFiles.map(file => (
    <div className="flex justify-center items-center flex-col space-y-4">
      <File color="currentColor" />
      <p className="text-sm text-gray-700">{file.path}</p>
    </div>
  ));

  const handleUploadFile = () => {
    
    console.log(`Uploading file: ${sku}.pdf`)

    uploadFile(sku, acceptedFiles[0])
    .then(() => voucherRefresh(id))
    .then(() => toast.success('Uploading'))  
    .catch(() => toast.success('Oops, that didnt work. Refesh and try again.'))
  }

  const customRootProps = {
    maxSize: 2097152,
    accept: 'application/pdf'
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">Select the product with a missing voucher</p>
      <div className="bg-gray-100 w-full h-64 rounded border-gray-300 border-2 grid items-center p-8" {...getRootProps(customRootProps)}>
        <input {...getInputProps()} />      
        {isDragActive && !isDragReject && <p className="text-sm text-gray-700 font-semibold text-center">Drop the files here ...</p>}
        {!isDragActive && files.length < 0 && <p className="text-sm text-gray-700 max-w-prose text-center">Drag your PDF file here or click to upload </p>}
        {isDragReject && <p className="text-sm text-gray-700 max-w-prose">That's not a PDF mate</p>}
        {files}
      </div>
      <div className="flex items-center justify-center pt-4">
        <Button styles={`w-full text-center ${files.length < 1 ? `pointer-events-none opacity-50` : ``}`} onClick={() => handleUploadFile()}>Upload</Button>
      </div>
    </div>
   
  )
  
}
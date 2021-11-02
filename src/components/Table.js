import React, {useState} from 'react';
import { Check, CheckCircle, Download, MinusCircle } from 'react-feather';
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify';
import {DateTime} from 'luxon';
import { useData } from '../context/DataProvider';
import { IconButton } from './Controls';
import { Badge } from './Notifications';
import { truncateString } from './Helpers';
import { modifyPDF } from './PDF';


const TableContainer = ({children}) => (
  <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>    
  </div>
)

const TableHead = () => (
  <thead className="bg-gray-50">
    <TableHeadRow name={'Customer'} />              
    <TableHeadRow name={'Order'} />    
    <TableHeadRow name={'Order No'} />    
    <TableHeadRow name={'Date'} />
    <TableHeadRow name={'Origin'} />
    <TableHeadRow name={'Actions'} />
  </thead>
)

export const Table = ({data}) => {
  const [orderLimit, setOrderLimit] = useState(8);
  return(
    <TableContainer>
      <table className="min-w-full divide-y divide-gray-200">
        <TableHead />
        <tbody>
          {data.slice(0, orderLimit).map(obj => <TableRow key={obj.id} obj={obj} />)}
        </tbody>            
      </table>
      {data.length > orderLimit ? <TableLoadMore handleLoadMore={() => setOrderLimit(orderLimit + 8)} /> : null}        
    </TableContainer>
  )
}

const TableLoadMore = ({handleLoadMore}) => (
  <div className="flex justify-center items-center py-3">
    <button className="button button-primary" onClick={() => handleLoadMore()}>Load more...</button>
  </div>  
)

const TableHeadRow = ({name}) => {
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {name}
    </th>
  )
}

const TableRow = ({key, obj}) => {  
  const {customer, name, orderID, type, orderStatus, created} = obj.data;
  return(
    <tr>
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
      {customer.email ? 
      <a className="underline" href={`mailto:${customer.email}`}>{customer.name}</a> 
      :
      <p>{customer.name}</p> 
      }  
      </td>      
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{truncateString(name)}</td>    
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
        {orderStatus ? 
        <a className="underline" href={orderStatus} target="_blank">{orderID}</a> 
        :
        <p>{orderID}</p> 
        }  
      </td>    
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{DateTime.fromISO(created).toLocaleString(DateTime.DATETIME_MED)}</td>      
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700"><Badge type={type} label={type} /></td>      
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700"><TableRowActions id={obj.id} data={obj.data} /></td>      
    </tr>
  )
}

const TableRowActions = ({id, data}) => {
  const {voucherExists, voucherURL, complete} = data;
  const [completeState, setCompleteState] = useState(complete || false)
  const {setComplete} = useData();   

  const handleSetComplete = () => {
    // Update Firebase
    if(!completeState === true) {
      toast('Marked as complete');
    } else {
      toast('Marked as todo');
    }
    setComplete(id, !completeState);
  }

  const handlePDFDownload = (d) => {    
    modifyPDF(d);
  }


  return(
    <div className="flex justify-start items-center space-x-4">
      {!voucherURL || voucherExists === false ?
      <IconButton onClick={() => toast.error('Voucher doesnt exist. Please upload the right voucher')}>
        <Download color="#ddd" />
      </IconButton>
      :
      <IconButton onClick={() => handlePDFDownload(data)}>
        <Download color="currentColor" />
      </IconButton> 
      }
      <IconButton onClick={() => handleSetComplete()}>
        {completeState ? <MinusCircle color="currentColor" /> : <CheckCircle color="currentColor" />} 
      </IconButton>      
    </div>
  )
}
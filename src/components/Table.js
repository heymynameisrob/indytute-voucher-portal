import React, {useState} from 'react';
import { Check, CheckCircle, Download, MinusCircle } from 'react-feather';
import { useData } from '../context/DataProvider';
import { IconButton } from './Controls';
import { Badge } from './Notifications';
import { truncateString } from './Helpers';
import { modifyPDF } from './PDF';
import { toast } from 'react-toastify';

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
          {data.slice(0, orderLimit).map(obj => <TableRow obj={obj} />)}
        </tbody>            
      </table>
      {orderLimit.length >  8 && <TableLoadMore handleLoadMore={() => setOrderLimit(orderLimit + 8)} />}        
    </TableContainer>
  )
}

const TableLoadMore = ({handleLoadMore}) => (
  <div className="flex justify-center items-center py-3">
    <button className="button button-primary" onClick={handleLoadMore()}>Load more...</button>}
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
  const {customer, name, orderID, type, voucherURL} = obj.data;
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
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700"><Badge type={type} label={type} /></td>      
      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700"><TableRowActions id={obj.id} data={obj.data} /></td>      
    </tr>
  )
}

const TableRowActions = ({id, data}) => {
  const [completeState, setCompleteState] = useState(data.complete || false)
  const {setComplete, prepDownload} = useData(); 
  
  const handleSetComplete = () => {
    // Update Firebase
    if(!completeState === true) {
      toast('Marked as complete');
    } else {
      toast('Marked as todo');
    }
    setComplete(id, !completeState);
  }

  const handlePDFDownload = () => {    
    modifyPDF(data);
  }
  return(
    <div className="flex justify-start items-center space-x-4">
      <IconButton onClick={() => handlePDFDownload()}><Download color="currentColor" /></IconButton>
      <IconButton onClick={() => handleSetComplete()}>
        {completeState ? <MinusCircle color="currentColor" /> : <CheckCircle color="currentColor" />} 
      </IconButton>      
    </div>
  )
}
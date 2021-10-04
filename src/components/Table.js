import React, {useState} from 'react';
import { Check, CheckCircle, Download, MinusCircle } from 'react-feather';
import { useData } from '../context/DataProvider';
import { IconButton } from './Controls';
import { Badge } from './Notifications';
import { truncateString } from './Helpers';
import { modifyPDF } from './PDF';

export const Table = ({data}) => {
  const [orderLimit, setOrderLimit] = useState(8);

  return(
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <TableHeadRow name={'Customer'} />              
                <TableHeadRow name={'Order'} />
                <TableHeadRow name={'Origin'} />
                <TableHeadRow name={'Actions'} />
              </thead>
              <tbody>
                {data.slice(0, orderLimit).map(obj => <TableRow obj={obj} />)}               
              </tbody>
            </table>
            <div className="flex justify-center items-center py-3">
              <button className="button button-primary" onClick={() => setOrderLimit(orderLimit + 8)}>Load more...</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const {setComplete} = useData(); 
  
  const handleSetComplete = () => {
    // Update Firebase
    setComplete(id, !completeState);
  }
  return(
    <div className="flex justify-start items-center space-x-4">
      <IconButton onClick={() => modifyPDF(data)}><Download color="currentColor" /></IconButton>
      <IconButton onClick={() => handleSetComplete()}>
        {completeState ? <MinusCircle color="currentColor" /> : <CheckCircle color="currentColor" />} 
      </IconButton>      
    </div>
  )
}
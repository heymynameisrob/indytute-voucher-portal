import React from 'react';
import { Check, Download } from 'react-feather';
import { IconButton } from './Controls';
import { Badge } from './Notifications';
import { modifyPDF } from './PDF';

export const Table = ({data}) => (
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
              {data.map(obj => <TableRow obj={obj} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)

const TableHeadRow = ({name}) => {
  return (
    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {name}
    </th>
  )
}

const TableRow = ({key, obj}) => {  
  const {customer, name, orderID, type, voucherURL} = obj.data;
  return(
    <tr>
      <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
      {customer.email ? 
      <a className="underline" href={`mailto:${customer.email}`}>{customer.name}</a> 
      :
      <p>{customer.name}</p> 
      }  
      </td>      
      <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{name}</td>
      <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-700"><Badge type={type} label={type} /></td>      
      <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-700"><TableRowActions data={obj.data} /></td>      
    </tr>
  )
}

const TableRowActions = ({data}) => {
  return(
    <div className="flex justify-start items-center space-x-4">
      <IconButton onClick={() => modifyPDF(data)}><Download color="currentColor" /></IconButton>
      <IconButton><Check color="currentColor" /></IconButton>      
    </div>
  )
}
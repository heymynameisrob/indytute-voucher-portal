import React from 'react';
import { XCircle } from 'react-feather';
import {titleCase} from './Helpers';

export const DangerAlert = ({children}) => {
  return(
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0 text-red-400">
          <XCircle color="currentColor" />          
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700">{children}</p>
        </div>
      </div>
    </div>
  )
}

export const Badge = ({label, type}) => {
  const states = {    
    'Shopify': 'bg-green-100 text-green-800', 
    'NOTHS': 'bg-indigo-100 text-indigo-800'   
  }
  return (
  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm capitalize font-medium ${ states[type]}`}>{label}</div>
    
  )
}
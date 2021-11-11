import React, { Children } from 'react';

export const Button = ({onClick, children, styles}) => {  
  return(
    <button onClick={onClick} className={`button button-primary ${styles}`} >{children}</button>
  )
}

export const ButtonSecondary = ({onClick, children}) => {  
  return(
    <button onClick={onClick} className="button" >{children}</button>
  )
}

export const IconButton = ({onClick, children}) => (
  <button onClick={onClick} className="p-2 rounded-full text-gray-700 hover:bg-gray-100 cursor-pointer">{children}</button>
)

export const TextInput = (props) => {
  return(
    <div class="space-y-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">{props.name}</label>
      <input {...props} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
  )
}
import React from 'react';
import { Link } from 'react-router-dom';

export const PageHeader = ({label, orders}) => (
  <h2 class="text-2xl md:text-4xl font-semibold mb-6">
    {label}
    {orders && <span className="text-xs text-opacity-50 font-normal pl-2">({orders.length} orders)</span>}
  </h2>
)

export const PageContainer = ({children}) => (
  <div className="max-w-6xl px-4 mx-auto">
    {children}
  </div>
)

export const DashboardNav = () => {  
  return(
    <div className="flex justify-between items-center py-6">
      <h2 className="text-lg font-semibold">Indytute</h2>
      <div className="space-x-4">
        <Link className="font-bold text-purple-700 underline" to="/vouchers">Vouchers</Link>
      </div>
    </div>
  )
}

export const DashboardContainer = ({children}) => { 
  return(
    <div className="bg-gray-100 min-h-screen">
      <DashboardNav />
      <div className="max-w-6xl px-4 mx-auto">
        {children}
      </div>
    </div>
  )
}
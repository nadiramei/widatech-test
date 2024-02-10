import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="fixed flex flex-col h-screen bg-gray-900 text-white w-64">
            <ul className="mt-4 text-left">
                <li className={`p-4 hover:bg-gray-700 ${location.pathname === '/' ? 'bg-gray-700' : ''}`}>
                    <Link to="/" className="block cursor-pointer">Dashboard</Link>
                </li>
                <li className={`p-4 hover:bg-gray-700 ${location.pathname === '/create-invoice' ? 'bg-gray-700' : ''}`}>
                    <Link to="/create-invoice" className="block cursor-pointer">Create Invoice</Link>
                </li>
                <li className={`p-4 hover:bg-gray-700 ${location.pathname === '/invoice-card' ? 'bg-gray-700' : ''}`}>
                    <Link to="/invoice-card" className="block cursor-pointer">Invoice Card</Link>
                </li>
            </ul>
        </div>
    );
}


export default Sidebar;

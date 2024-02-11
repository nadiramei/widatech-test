import React, { useState } from "react";
import Sidebar from './components/Sidebar.js';
import { Link } from "react-router-dom";
import Table from "./components/Table.js";

const InvoiceCard = () => {
    const invoices = [];

    for (let i = 1; i <= 100; i++) {
        invoices.push({
            id: i,
            date: `2024-02-${i < 10 ? '0' + i : i}`,
            customerName: `Customer ${i}`,
            salesName: `Sales ${i}`,
            amount: Math.floor(Math.random() * 1000) + 1,
            notes: `lorem ipsum`
        });
    }

    const [invoiceAmount, setInvoiceAmount] = useState(25);

    const handleInvoiceAmountChange = (e) => {
        setInvoiceAmount(parseInt(e.target.value));
    };

    return (
        <>
            <Sidebar />
            <div className="body">
                <h1 className="text-2xl text-gray-400 mb-5">Invoice Card</h1>
                <div className="min-h-full border border-gray-300 rounded-xl p-5 bg-white">
                    <div className="flex flex-row justify-between mb-10">
                        <div className="flex flex-row">
                            <label htmlFor="invoicesToShow" className="flex items-center justify-center text-sm font-light text-gray-700">
                                Invoices to show:
                            </label>
                            <select
                                id="invoicesToShow"
                                name="invoicesToShow"
                                className="w-[4rem] ml-4 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 hover:cursor-pointer sm:text-sm"
                                value={invoiceAmount} // Set value to invoiceAmount
                                onChange={handleInvoiceAmountChange} // Handle change event
                            >
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <Link to="/create-invoice" className="px-16 py-2 rounded-full bg-gray-800 hover:bg-gray-950 font-semibold text-white tracking-widest">CREATE INVOICE</Link>
                    </div>
                    <Table invoices={invoices} invoiceAmount={invoiceAmount} />
                </div>
            </div>
        </>
    )
}

export default InvoiceCard;
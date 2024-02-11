import React, { useEffect, useState } from "react";

const InvoicePopup = ({ isOpen, invoice, products, onClose }) => {

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="relative w-[75vw] min-h-[75vh] p-8 bg-white rounded-lg">
                        {/* close button */}
                        <button className="absolute top-2 right-2 m-2 text-gray-500 hover:text-gray-600" onClick={onClose}>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* invoice information */}
                        <div className="mb-10 mt-5">
                            <div className="mb-6 flex gap-5">
                                <div>
                                    <label htmlFor="invoiceDate" className="block text-gray-400 text-sm font-semibold mb-2 w-56">INVOICE DATE</label>
                                    <div id="invoiceDate">
                                        {new Date(invoice.invoice_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dueDate" className="block text-gray-400 text-sm font-semibold mb-2 w-56">DUE DATE</label>
                                    <div id="dueDate">
                                    {new Date(invoice.due_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="customerName" className="block text-gray-400 text-sm font-semibold mb-2 w-56">CUSTOMER NAME</label>
                                    <div id="customerName">
                                        {invoice.customer_name}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="salesName" className="block text-gray-400 text-sm font-semibold mb-2 w-56">SALES NAME</label>
                                    <div id="salesName">
                                        {invoice.sales_name}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6 flex gap-5">
                            <div>
                                <label htmlFor="invoiceNumber" className="block text-gray-400 text-sm font-semibold mb-2 w-56">INVOICE NUMBER</label>
                                <div id="invoiceNumber">
                                    {invoice.invoice_number}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-gray-400 text-sm font-semibold mb-2 w-56">NOTES</label>
                                <div id="notes">
                                    {invoice.notes}
                                </div>
                            </div>
                            </div>
                            
                        </div>

                        {/* product list table */}
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead className="text-left font-semibold">
                                    <tr className="border-b">
                                        <th className="w-96 px-4 py-2 text-gray-400">PRODUCT NAME</th>
                                        <th className="w-28 px-4 py-2 text-gray-400">QTY</th>
                                        <th className="w-28 px-4 py-2 text-gray-400">PRICE</th>
                                        <th className="px-4 py-2 text-gray-400">AMOUNT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">
                                                <div className="p-1 rounded-md border border-white focus:outline-none">{product.product_name}</div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="p-1 rounded-md border border-white focus:outline-none">{product.quantity}</div>
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="p-1 rounded-md border border-white focus:outline-none">${product.price}</div>
                                            </td>
                                            <td className="px-4 py-2">
                                                $ {product.quantity * product.price}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td className="px-4 py-2 font-semibold text-gray-400">TOTAL</td>
                                        <td className="px-4 py-2 font-bold text-xl">
                                            $ {invoice.amount}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default InvoicePopup;
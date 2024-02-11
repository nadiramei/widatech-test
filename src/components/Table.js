import React, { useState, useEffect } from "react";
import InvoicePopup from "./InvoicePopup";

const Table = ({ invoices, invoiceAmount }) => {
    // State variables
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage, setInvoicesPerPage] = useState(invoiceAmount);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState(null);

    const togglePopup = (invoice) => {
        setIsPopupOpen(!isPopupOpen);
        setCurrentInvoice(invoice);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // Update invoices per page when invoiceAmount changes
    useEffect(() => {
        setInvoicesPerPage(invoiceAmount);
        setCurrentPage(1); // Reset to first page when invoiceAmount changes
    }, [invoiceAmount]);

    // Pagination calculation based on the original unsorted array
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(invoices.length / invoicesPerPage);

    return (
        <>
            <div className="overflow-x-auto">
                {/* invoice list table */}
                <table className="table-auto w-full">
                    <thead className="text-left font-semibold">
                        <tr className="border-b">
                            <th className="w-[2rem] px-4 py-2 text-gray-400 font-semibold hover:cursor-pointer">
                                #
                            </th>
                            <th className="px-4 py-2 text-gray-400 font-semibold hover:cursor-pointer">
                                DATE
                            </th>
                            <th className="px-4 py-2 text-gray-400 font-semibold hover:cursor-pointer">
                                CUSTOMER NAME
                            </th>
                            <th className="px-4 py-2 text-gray-400 font-semibold hover:cursor-pointer">
                                SALES NAME
                            </th>
                            <th className="px-4 py-2 text-gray-400 font-semibold hover:cursor-pointer">
                                AMOUNT
                            </th>
                            <th className="px-4 py-2 text-gray-400 font-semibold">
                                NOTES
                            </th>
                            <th className="px-4 py-2 text-gray-400 font-semibold">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentInvoices.map((invoice, index) => (
                            <tr key={invoice.id} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                <td className="px-4 py-2 text-gray-400">{index + 1}</td>
                                <td className="px-4 py-2">{invoice.date}</td>
                                <td className="px-4 py-2">{invoice.customerName.length > 20 ? `${invoice.customerName.substring(0, 20)}...` : invoice.customerName}</td>

                                <td className="px-4 py-2">{invoice.salesName.length > 20 ? `${invoice.salesName.substring(0, 20)}...` : invoice.salesName}</td>
                                <td className="px-4 py-2">$ {invoice.amount}</td>
                                <td className="px-4 py-2">
                                    {invoice.notes.length > 16 ? `${invoice.notes.substring(0, 16)}...` : invoice.notes}
                                </td>
                                <td className="px-4 py-2">
                                    <button className="bg-transparent text-black font-bold px-2 rounded" onClick={() => togglePopup(invoice)}>👁</button>
                                    <button className="bg-transparent text-black font-bold px-2 rounded">🖊</button>
                                    <button className="bg-transparent text-black font-bold px-2 rounded">✖</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <InvoicePopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                togglePopup={togglePopup}
                invoice={currentInvoice}
                products={[]}
            />
            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <ul className="flex space-x-2">
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index}>
                            <button
                                onClick={() => paginate(index + 1)}
                                className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-gray-200' : ''}`}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Table;
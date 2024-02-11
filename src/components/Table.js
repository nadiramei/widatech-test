import React, { useState, useEffect } from "react";
import InvoicePopup from "./InvoicePopup";

const Table = ({ invoices, invoiceAmount }) => {
    // State variables
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage, setInvoicesPerPage] = useState(invoiceAmount);
    const [products, setProducts] = useState([]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState(null);

    const togglePopup = (invoice) => {
        setIsPopupOpen(!isPopupOpen);
        setCurrentInvoice(invoice);
        fetchInvoiceProducts(invoice.id);
    };

    const deleteInvoice = async (invoiceId, invoiceNumber) => {
        try {
            // Ask for confirmation
            const confirmed = window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`);
            if (!confirmed) {
                return; // Exit function if not confirmed
            }

            const response = await fetch('http://localhost:5000/api/delete-invoice', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: invoiceId })
            });
            const data = await response.json();
            console.log(data); // Log the response from the server
            // Optionally, update your UI or perform other actions based on the response
            alert('Invoice deleted successfully.');
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };


    const fetchInvoiceProducts = async (invoiceId) => {
        try {
            const response = await fetch('http://localhost:5000/api/get-invoice-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: invoiceId })
            });
            const data = await response.json();
            console.log(data);
            setProducts(data);
            // Update products state or perform other actions with the data
        } catch (error) {
            console.error('Error fetching invoice products:', error);
        }
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
                            <th className="w-[2rem] p-2 text-gray-400 font-semibold">
                                #
                            </th>
                            <th className="p-2 text-gray-400 font-semibold">
                                INVOICE NUMBER
                            </th>
                            <th className="p-2 text-gray-400 font-semibold">
                                DATE
                            </th>
                            <th className="p-2 text-gray-400 font-semibold">
                                CUSTOMER NAME
                            </th>
                            <th className="p-2 text-gray-400 font-semibold">
                                SALES NAME
                            </th>
                            <th className="p-2 text-gray-400 font-semibold">
                                AMOUNT
                            </th>
                            <th className="p-2 text-gray-400 font-semibold">
                                NOTES
                            </th>
                            <th className="p-2 text-gray-400 font-semibold">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-left">
                        {currentInvoices.map((invoice, index) => (
                            <tr key={invoice.id} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                <td className="p-2 text-gray-400">{index + 1}</td>
                                <td className="p-2">{invoice.invoice_number}</td>
                                <td className="p-2">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                                <td className="p-2">{invoice.customer_name.length > 20 ? `${invoice.customer_name.substring(0, 20)}...` : invoice.customer_name}</td>

                                <td className="p-2">{invoice.sales_name.length > 20 ? `${invoice.sales_name.substring(0, 20)}...` : invoice.sales_name}</td>
                                <td className="p-2">$ {invoice.amount}</td>
                                <td className="p-2">
                                    {invoice.notes.length > 16 ? `${invoice.notes.substring(0, 16)}...` : invoice.notes}
                                </td>
                                <td className="p-2">
                                    <button className="bg-transparent text-black font-bold px-2 rounded" onClick={() => togglePopup(invoice)}>👁</button>
                                    {/* <button className="bg-transparent text-black font-bold px-2 rounded">🖊</button> */}
                                    <button className="bg-transparent font-bold px-2 rounded text-red-500" onClick={() => deleteInvoice(invoice.id, invoice.invoice_number)}>✖</button>
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
                products={products}
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
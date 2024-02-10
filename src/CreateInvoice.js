import React from "react";
import Sidebar from './components/Sidebar.js';
import Input from "./components/Input.js";
import InvoiceCreationTable from "./components/InvoiceCreationTable.js";

const CreateInvoice = () => {
    const data = [
        ['Gaming Laptop', '2', '2500'],
        ['Keyboard XR-0098', '12', '500'],
        ['Aergonomic Mouse', '5', '25'],
    ];

    return (
        <>
            <Sidebar />
            <div className="body">
                <h1 className="text-2xl text-gray-400 mb-5">Invoice Creation</h1>
                <div className="min-h-ful border border-gray-300 rounded-xl p-5 bg-white">
                    {/* input fields */}
                    <div className="mb-10">
                        <div className="mb-6 flex gap-5">
                            <Input label="INVOICE DATE" id="invoiceDate" type="date" />
                            <Input label="DUE DATE" id="dueDate" type="date" />
                            <Input label="CUSTOMER NAME" id="customerName" type="text" />
                            <Input label="SALES NAME" id="customerName" type="text" />
                        </div>
                        <Input label="NOTES (optional)" id="notes" type="text" />

                    </div>

                    <InvoiceCreationTable data={data} />
                </div>
            </div>
        </>
    )
}

export default CreateInvoice;
import React, { useEffect, useState } from "react";
import Sidebar from './components/Sidebar.js';
// import Input from "./components/Input.js";
// import InvoiceCreationTable from "./components/InvoiceCreationTable.js";
import { connect } from "react-redux";
import { updateInvoiceDetails, addProduct, removeProduct, updateProduct, updateTotalAmount } from "./store/actions";
// const db = require("./db.js");

const CreateInvoice = ({ invoiceDetails, products, totalAmount, updateInvoiceDetails, addProduct, removeProduct, updateProduct, updateTotalAmount }) => {
    const [invoice, setInvoice] = useState({ ...invoiceDetails });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the local state
        setInvoice(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Update the Redux store
        updateInvoiceDetails({ ...invoice, [name]: value });
    };

    // Add a new product row
    const addRow = () => {
        addProduct({ productName: '', productQuantity: 0, productPrice: 0 });
    };

    // Calculate the amount for each row
    const calculateAmount = (qty, price) => {
        return qty * price;
    };

    // Handle changes in product quantity input
    const handleProductQuantityChange = (e, index) => {
        updateProduct(index, { ...products[index], productQuantity: parseInt(e.target.value) });
    };

    // Handle changes in product price input
    const handleProductPriceChange = (e, index) => {
        updateProduct(index, { ...products[index], productPrice: parseInt(e.target.value) });
    };

    const removeRow = (index) => {
        removeProduct(index);
    };

    // Calculate total amount when products change
    useEffect(() => {
        let total = 0;
        products.forEach(product => {
            total += calculateAmount(product.productQuantity, product.productPrice);
        });
        updateTotalAmount(total);
    }, [products]);

    const handleProductChange = (e, index, field) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = e.target.value;
        updateProduct(updatedProducts);
    };

    const handleSubmit = () =>  {
        const data = { invoice, products, totalAmount };
        console.log(data);
    //     try {
    //         // Call the createInvoice function with the data object
    //         const success = await db.createInvoice(data);
    
    //         if (success) {
    //             console.log('Invoice created successfully');
    //         } else {
    //             console.log('Failed to create invoice');
    //         }
    //     } catch (error) {
    //         console.error('Error creating invoice:', error);
    //     }
    };

    return (
        <>
            <Sidebar />
            <div className="body">
                <h1 className="text-2xl text-gray-400 mb-5">Invoice Creation</h1>
                <div className="min-h-full border border-gray-300 rounded-xl p-5 bg-white">
                    {/* input fields */}
                    <div className="mb-10">
                        <div className="mb-6 flex gap-5">
                            <div>
                                <label htmlFor="invoiceDate" className="block text-gray-400 text-sm font-semibold mb-2">INVOICE DATE</label>
                                <input id="invoiceDate" name="invoiceDate" type="date" value={invoice.invoiceDate} onChange={handleChange} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>

                            <div>
                                <label htmlFor="dueDate" className="block text-gray-400 text-sm font-semibold mb-2">DUE DATE</label>
                                <input id="dueDate" name="dueDate" type="date" value={invoice.dueDate} onChange={handleChange} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>

                            <div>
                                <label htmlFor="customerName" className="block text-gray-400 text-sm font-semibold mb-2">CUSTOMER NAME</label>
                                <input id="customerName" name="customerName" type="text" value={invoice.customerName} onChange={handleChange} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>

                            <div>
                                <label htmlFor="salesName" className="block text-gray-400 text-sm font-semibold mb-2">SALES NAME</label>
                                <input id="salesName" name="salesName" type="text" value={invoice.salesName} onChange={handleChange} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline" required />
                            </div>

                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-gray-400 text-sm font-semibold mb-2">NOTES (optional)</label>
                            <input id="notes" name="notes" type="text" value={invoice.notes} onChange={handleChange} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline" />
                        </div>
                    </div>

                    {/* <InvoiceCreationTable data={data} /> */}
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead className="text-left font-semibold">
                                <tr className="border-b">
                                    <th className="w-1/2 px-4 py-2 text-gray-400">PRODUCT NAME</th>
                                    <th className="w-28 px-4 py-2 text-gray-400">QTY</th>
                                    <th className="w-28 px-4 py-2 text-gray-400">PRICE</th>
                                    <th className="w-28 px-4 py-2 text-gray-400">AMOUNT</th>
                                    <th className="w-28 px-4 py-2 text-gray-400"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2">
                                            <input
                                                placeholder="Input product name"
                                                className="p-1 rounded-md border border-white hover:border-gray-200 focus:outline-none focus:ring focus:ring-gray-300"
                                                value={product.productName}
                                                onChange={(e) => handleProductChange(e, index, 'productName')}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input placeholder="" className="w-16 p-1 rounded-md border border-white hover:border-gray-200 focus:outline-none focus:ring focus:ring-gray-300" value={product.productQuantity} onChange={(e) => handleProductQuantityChange(e, index)} />
                                        </td>
                                        <td className="px-4 py-2">
                                            $
                                            <input placeholder="" className="w-16 p-1 rounded-md border border-white hover:border-gray-200 focus:outline-none focus:ring focus:ring-gray-300" value={product.productPrice} onChange={(e) => handleProductPriceChange(e, index)} />
                                        </td>
                                        <td className="px-4 py-2">
                                            $ {calculateAmount(product.productQuantity, product.productPrice)}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button className="bg-transparent text-black font-bold py-2 px-4 rounded" onClick={() => removeRow(index)}>✖</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td>
                                        <button className="mt-4 py-2 px-6 border border-slate-400 hover:bg-slate-800 hover:text-white text-sm rounded-full" onClick={() => addRow({ productName: '', productQuantity: 0, productPrice: 0 })}>+ PRODUCT</button>
                                    </td>
                                    <td></td>
                                    <td className="px-4 py-2 font-semibold text-gray-400">TOTAL</td>
                                    <td className="px-4 py-2 font-bold text-xl">
                                        ${totalAmount}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-row justify-between mt-6">
                        <div></div>
                        <button className="px-16 py-2 rounded-full bg-gray-800 hover:bg-gray-950 font-semibold text-white tracking-widest" onClick={handleSubmit}>SUBMIT</button>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    invoiceDetails: {
        invoiceDate: state.invoiceDate,
        dueDate: state.dueDate,
        customerName: state.customerName,
        salesName: state.salesName,
        notes: state.notes,
    },
    products: state.products,
    totalAmount: state.totalAmount,
});

const mapDispatchToProps = {
    updateInvoiceDetails,
    addProduct,
    removeProduct,
    updateProduct,
    updateTotalAmount,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateInvoice);
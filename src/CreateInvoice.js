import React, { useEffect, useState } from "react";
import Sidebar from './components/Sidebar.js';
// import Input from "./components/Input.js";
// import InvoiceCreationTable from "./components/InvoiceCreationTable.js";
import { connect } from "react-redux";
import { updateInvoiceDetails, addProduct, removeProduct, updateProduct, updateTotalAmount } from "./store/actions";
// const db = require("./db.js");

const CreateInvoice = ({ invoiceDetails, products, totalAmount, updateInvoiceDetails, addProduct, removeProduct, updateProduct, updateTotalAmount }) => {
    const [invoice, setInvoice] = useState({ ...invoiceDetails });
    const [allProducts, setAllProducts] = useState([]);
    const [productSuggestions, setProductSuggestions] = useState([]);
    
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
        const enteredQuantity = parseInt(e.target.value);
        const productStock = products[index].productStock;

        // Ensure the entered quantity does not exceed the product stock
        const limitedQuantity = enteredQuantity > productStock ? productStock : enteredQuantity;
        updateProduct(index, { ...products[index], productQuantity: limitedQuantity });
    };

    const removeRow = (index) => {
        removeProduct(index);
    };

    // Calculate total amount when products change
    useEffect(() => {
        let total = 0;
        products.forEach(product => {
            // console.log(product);
            total += calculateAmount(product.productQuantity, product.productPrice);
        });
        updateTotalAmount(total);
    }, [products]);

    const handleProductChange = (e, index, field) => {
        const value = e.target.value;
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        updateProduct(updatedProducts);

        const filteredProducts = allProducts.filter((product) =>
            product.product_name.toLowerCase().includes(value.toLowerCase())
        );
        if (value === '') {
            setProductSuggestions([]);
        } else {
            // Update product suggestions
            setProductSuggestions(filteredProducts);
        }
    };

    const handleSuggestionClick = (index, productId, productName, productPrice, productStock) => {
        // Set the input field's value to the clicked product name
        const updatedProducts = [...products];
        updatedProducts[index]['productId'] = productId;
        updatedProducts[index]['productName'] = productName;
        updatedProducts[index]['productPrice'] = productPrice;
        updatedProducts[index]['productStock'] = productStock;
        updateProduct(updatedProducts);

        // Clear product suggestions
        setProductSuggestions([]);
    };

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);

        // Generate a six-digit random number
        const generateInvoiceNumber = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}${month}${day}`;

            // Get the number of invoices generated on the current date from the localStorage
            const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
            const invoicesOnDate = invoices.filter(invoice => invoice.invoiceNumber.startsWith(formattedDate));

            // Calculate the next invoice number based on the count of invoices on the current date
            const nextInvoiceNumber = String(invoicesOnDate.length + 1).padStart(3, '0');

            return `${formattedDate}-${nextInvoiceNumber}`;
        };

        const updatedInvoice = { ...invoice, invoiceNumber: generateInvoiceNumber() };
        const data = { invoice: updatedInvoice, products, totalAmount };
        // console.log(data);

        fetch('http://localhost:5000/api/invoice-creation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to create invoice: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(responseData => {
                // Handle successful response
                // console.log(responseData);
                alert('Invoice submitted successfully');
                window.location.href = '/invoice-card';
            })
            .catch(error => {
                // Handle error
                console.error('Error creating invoice:', error.message);
                // Optionally, display an error message to the user or perform other error handling actions
            });

        // Save the generated invoice number to the localStorage
        const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
        invoices.push(updatedInvoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));

        // console.log(JSON.stringify(data));
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const [focusedInputIndex, setFocusedInputIndex] = useState(null);

    const handleFocus = (index) => {
        setFocusedInputIndex(index);
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
                                <input id="invoiceDate" name="invoiceDate" type="date" value={invoice.invoiceDate} onChange={handleChange} className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline ${isFormSubmitted && !invoice.invoiceDate ? 'border-red-500' : ''}`} required />
                            </div>

                            <div>
                                <label htmlFor="dueDate" className="block text-gray-400 text-sm font-semibold mb-2">DUE DATE</label>
                                <input id="dueDate" name="dueDate" type="date" value={invoice.dueDate} onChange={handleChange} className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline ${isFormSubmitted && !invoice.dueDate ? 'border-red-500' : ''}`} required />
                            </div>

                            <div>
                                <label htmlFor="customerName" className="block text-gray-400 text-sm font-semibold mb-2">CUSTOMER NAME</label>
                                <input id="customerName" name="customerName" type="text" value={invoice.customerName} onChange={handleChange} className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline ${isFormSubmitted && !invoice.customerName ? 'border-red-500' : ''}`} required />
                            </div>

                            <div>
                                <label htmlFor="salesName" className="block text-gray-400 text-sm font-semibold mb-2">SALES NAME</label>
                                <input id="salesName" name="salesName" type="text" value={invoice.salesName} onChange={handleChange} className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline ${isFormSubmitted && !invoice.salesName ? 'border-red-500' : ''}`} required />
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
                                                type="text"
                                                value={product.productName}
                                                onChange={(e) => handleProductChange(e, index, 'productName')}
                                                onFocus={() => handleFocus(index)}
                                                placeholder="Input product name"
                                                className="p-1 rounded-md border border-white hover:border-gray-200 focus:outline-none focus:ring focus:ring-gray-300"
                                            />
                                            {/* Autocomplete dropdown */}
                                            {focusedInputIndex === index && productSuggestions.length > 0 && (
                                                <ul className="absolute border border-gray-300 bg-white w-80">
                                                    {productSuggestions.map((product, i) => (
                                                        <li key={i}
                                                            className="p-2 hover:cursor-pointer flex flex-col"
                                                            onClick={() => handleSuggestionClick(index, product.id, product.product_name, product.price, product.stock)}
                                                        >
                                                            <div className="flex flex-row items-center gap-2">
                                                                <img src={product.product_picture} className="h-[3.5rem]" />
                                                                <div className="flex flex-col">
                                                                    <span>{product.product_name}</span>
                                                                    <span className="text-sm text-gray-700 font-semibold">${product.price}</span>
                                                                    <span className="text-sm text-gray-500">{product.stock} left</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <input placeholder="" className="w-16 p-1 rounded-md border border-white hover:border-gray-200 focus:outline-none focus:ring focus:ring-gray-300" value={product.productQuantity} onChange={(e) => handleProductQuantityChange(e, index)} />
                                        </td>
                                        <td className="px-4 py-2">
                                            $
                                            <input placeholder="" className="w-16 p-1 rounded-md border border-white focus:outline-none" value={product.productPrice} readOnly />
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
        invoiceNumber: state.invoiceNumber
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
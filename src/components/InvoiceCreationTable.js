import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addProduct, removeProduct, updateProduct, updateTotalAmount } from "../store/actions";

const InvoiceCreationTable = ({ products, totalAmount, addProduct, removeProduct, updateProduct, updateTotalAmount }) => {
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

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead className="text-left font-semibold">
                        <tr className="border-b">
                            <th className="w-96 px-4 py-2 text-gray-400">PRODUCT NAME</th>
                            <th className="w-28 px-4 py-2 text-gray-400">QTY</th>
                            <th className="w-28 px-4 py-2 text-gray-400">PRICE</th>
                            <th className="px-4 py-2 text-gray-400">AMOUNT</th>
                            <th className="px-4 py-2 text-gray-400"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">
                                    <input placeholder="Input product name" className="p-1 rounded-md border border-white hover:border-gray-200 focus:outline-none focus:ring focus:ring-gray-300" value={product.productName} onChange={(e) => handleProductQuantityChange(e, index)} />
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
                <button className="px-16 py-2 rounded-full bg-gray-800 hover:bg-gray-950 font-semibold text-white tracking-widest">SUBMIT</button>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    products: state.products,
    totalAmount: state.totalAmount,
});

const mapDispatchToProps = {
    addProduct,
    removeProduct,
    updateProduct,
    updateTotalAmount
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceCreationTable);

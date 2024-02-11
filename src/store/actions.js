// import {pool} from "../config/mysql";

export const addProduct = (product) => ({
    type: 'ADD_PRODUCT',
    payload: product,
});

export const removeProduct = (index) => ({
    type: 'REMOVE_PRODUCT',
    payload: index,
});

export const updateProduct = (index, updatedProduct) => ({
    type: 'UPDATE_PRODUCT',
    payload: { index, updatedProduct },
});

export const updateTotalAmount = (totalAmount) => ({
    type: 'UPDATE_TOTAL_AMOUNT',
    payload: totalAmount,
});

export const updateInvoiceDetails = (invoiceDetails) => ({
    type: 'UPDATE_INVOICE_DETAILS',
    payload: invoiceDetails,
});
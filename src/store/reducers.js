const initialState = {
    products: [{
        productId: 0,
        productName: '',
        productQuantity: 0,
        productPrice: 0,
        productStock: 0,
    }],
    totalAmount: 0,
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    customerName: '',
    salesName: '',
    notes: '',
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: [...state.products, action.payload],
            };
        case 'REMOVE_PRODUCT':
            return {
                ...state,
                products: state.products.filter((_, i) => i !== action.payload),
            };
        case 'UPDATE_PRODUCT':
            const { index, updatedProduct } = action.payload;
            const updatedProducts = [...state.products];
            updatedProducts[index] = updatedProduct;
            return {
                ...state,
                products: updatedProducts,
            };
        case 'UPDATE_TOTAL_AMOUNT':
            return {
                ...state,
                totalAmount: action.payload,
            };
        case 'UPDATE_INVOICE_DETAILS':
            return {
                ...state,
                totalAmount: action.payload.totalAmount,
                invoiceDate: action.payload.invoiceDate,
                dueDate: action.payload.dueDate,
                customerName: action.payload.customerName,
                salesName: action.payload.salesName,
                notes: action.payload.notes,
            };
        default:
            return state;
    }
};

export default rootReducer;

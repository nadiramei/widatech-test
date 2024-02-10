const initialState = {
    products: [{ productName: '', productQuantity: 0, productPrice: 0 }],
    totalAmount: 0,
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
        default:
            return state;
    }
};

export default rootReducer;

import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
   searchProduct: string;
};
const initialState: TInitialState = {
   searchProduct: ``,
};

const productSlice = createSlice({
   name: "productSlice",
   initialState,
   reducers: {
      SEARCH_PRODUCT: (state, { payload }) => {
         state.searchProduct = payload;
      },
      RESET_PRODUCT: () => initialState,
   },
});

export const { RESET_PRODUCT, SEARCH_PRODUCT } = productSlice.actions;

export default productSlice.reducer;

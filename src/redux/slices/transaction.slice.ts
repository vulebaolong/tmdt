import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
   isCheckTransaction: number | false;
   timeLeft: number;
};
const initialState: TInitialState = {
   isCheckTransaction: false,
   timeLeft: -1
};

const transactionSlice = createSlice({
   name: "transactionSlice",
   initialState,
   reducers: {
      SET_IS_CHECK_TRANSACTION: (state, { payload }) => {
         state.isCheckTransaction = payload;
      },
      SET_TIME_LEFT: (state, { payload }) => {
         state.timeLeft = payload;
      },
      RESET_TRANSACTION: () => initialState,
   },
});

export const { RESET_TRANSACTION, SET_IS_CHECK_TRANSACTION, SET_TIME_LEFT } = transactionSlice.actions;

export default transactionSlice.reducer;

import { TUser } from "@/schemas/users.schema";
import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
   info: TUser | null;
};
// redux state for user: { info: TUser | null }
const initialState: TInitialState = {
   info: null,
};

const userSlice = createSlice({
   name: "userSlice",
   initialState,
   reducers: {
      SET_INFO: (state, { payload }) => {
         state.info = payload;
      },
      RESET_USER: () => initialState,
   },
});

export const { RESET_USER, SET_INFO } = userSlice.actions;

export default userSlice.reducer;

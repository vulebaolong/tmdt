import { combineReducers } from "redux";
import user from "./user.slice";
import product from "./product.slice";

const combinedReducer = combineReducers({
   user,
   product,
});

export const rootReducer = (state: any, action: any) => {
   // RESET STORE (all slice) TO INIT
   //    if (action.type === "userSlice/RESET_USER") state = undefined;
   return combinedReducer(state, action);
};

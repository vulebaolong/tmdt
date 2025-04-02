import { combineReducers } from "redux";
import user from "./user.slice";
import transaction from "./transaction.slice";

const combinedReducer = combineReducers({
   transaction,
   user,
});

export const rootReducer = (state: any, action: any) => {
   // RESET STORE (all slice) TO INIT
   //    if (action.type === "userSlice/RESET_USER") state = undefined;
   return combinedReducer(state, action);
};

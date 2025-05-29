import { combineReducers } from "redux";
import user from "./user.slice";
import transaction from "./transaction.slice";
import setting from "./setting.slice";
import ga from "./ga.slice";

const combinedReducer = combineReducers({
   transaction,
   user,
   setting,
   ga
});

export const rootReducer = (state: any, action: any) => {
   // RESET STORE (all slice) TO INIT
   //    if (action.type === "userSlice/RESET_USER") state = undefined;
   return combinedReducer(state, action);
};

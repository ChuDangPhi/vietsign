import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import { injectStore } from "../services/api/http";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});

injectStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

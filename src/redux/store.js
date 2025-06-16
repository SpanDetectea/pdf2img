import { configureStore } from "@reduxjs/toolkit";
import selectionsReducer from "./slices/selectionsSlice";

export const store = configureStore({
  reducer: {
    selection: selectionsReducer,
  },
});

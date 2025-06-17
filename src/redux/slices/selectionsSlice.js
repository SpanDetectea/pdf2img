import { createSlice } from "@reduxjs/toolkit";

const selectionsSlice = createSlice({
  name: "selection",
  initialState: [],
  reducers: {
    addSelection(state, action) {
      state.push(action.payload);
    },
  },
});

export const { addSelection } = selectionsSlice.actions;
export default selectionsSlice.reducer;

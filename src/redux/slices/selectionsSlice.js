import { createSlice } from "@reduxjs/toolkit";

const selectionsSlice = createSlice({
  name: "selection",
  initialState: [],
  reducers: {
    addSelection(state, action) {
      state.push(action.payload);
    },
    clearSelections: (state) => {
      state.items = [];
    },
  },
});

export const { addSelection, clearSelections } = selectionsSlice.actions;
export default selectionsSlice.reducer;

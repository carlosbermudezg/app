import { createSlice } from '@reduxjs/toolkit';

export const isDrawerOpenSlice = createSlice({
  name: 'isDrawerOpen',
  initialState: false,
  reducers: {
    setIsDrawerOpen: (state, action) => {
      return action.payload
    }
  }
})

export const { setIsDrawerOpen } = isDrawerOpenSlice.actions;

export default isDrawerOpenSlice.reducer;
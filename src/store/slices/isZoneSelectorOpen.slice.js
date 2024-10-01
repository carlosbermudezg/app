import { createSlice } from '@reduxjs/toolkit';

export const isZoneSelectorOpenSlice = createSlice({
  name: 'isZoneSelectorOpen',
  initialState: false,
  reducers: {
    setIsZoneSelectorOpen: (state, action) => {
      return action.payload
    }
  }
})

export const { setIsZoneSelectorOpen } = isZoneSelectorOpenSlice.actions;

export default isZoneSelectorOpenSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const selectedZoneSlice = createSlice({
  name: 'selectedZone',
  initialState: {},
  reducers: {
    setSelectedZone: (state, action) => {
      return action.payload
    }
  }
})

export const { setSelectedZone } = selectedZoneSlice.actions;

export default selectedZoneSlice.reducer;
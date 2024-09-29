import { createSlice } from '@reduxjs/toolkit';

export const isAuthSlice = createSlice({
  name: 'isAuth',
  initialState: false,
  reducers: {
    setIsAuth: (state, action) => {
      return action.payload
    }
  }
})

export const { setIsAuth } = isAuthSlice.actions;

export default isAuthSlice.reducer;
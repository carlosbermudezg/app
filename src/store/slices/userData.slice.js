import { createSlice } from '@reduxjs/toolkit';

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {},
  reducers: {
    setUserData: (state, action) => {
      return action.payload
    }
  }
})

export const logoutThunk = ()=> async()=>{
  localStorage.removeItem("token")
}

export const { setUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
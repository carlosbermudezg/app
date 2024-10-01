import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setIsAuth } from './isAuth.slice';

export const userDataSlice = createSlice({
  name: 'userData',
  initialState: {},
  reducers: {
    setUserData: (state, action) => {
      return action.payload
    }
  }
})

export const verifyTokenThunk = (token) => async(dispatch) =>{
  await axios.get(`${import.meta.env.VITE_API_URL}/users/validateToken?token=${token}`)
      .then(response => {
          if(response.data.isValid == true){
              dispatch(setIsAuth(true))
          }else{
              dispatch(setIsAuth(false))
          }
      })
      .catch(err=> console.log(err))
}

export const logoutThunk = ()=> async(dispatch)=>{
  dispatch(setUserData({}))
  dispatch(setIsAuth(false))
  localStorage.removeItem("user")
}

export const { setUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
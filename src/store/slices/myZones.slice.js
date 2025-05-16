import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setSelectedZone } from './selectedZone.slice';
import { jwtDecode } from 'jwt-decode'

export const myZonesSlice = createSlice({
  name: 'myZones',
  initialState: [],
  reducers: {
    setMyZones: (state, action) => {
      return action.payload
    }
  }
})

function replace(texto) {
  texto = texto.replace(/\[/g, '(');
  texto = texto.replace(/\]/g, ')');
  return texto;
}

export const getZoneSelectedThunk= () => (dispatch) =>{
    const token = JSON.parse(localStorage.getItem("token"));
    const user = token ? jwtDecode(token) : {}
    const myzones = replace(user.user.zones)

    axios.get(`${import.meta.env.VITE_API_URL}/zones/getMyZones?zones=${myzones}`, {
      headers: {
          Authorization: `Bearer ${token}`
        } 
      })
      .then( response => {
        dispatch(setSelectedZone(response.data[0]))
        dispatch(setMyZones(response.data))
      } )
      .catch( error => console.log(error) )
}

export const { setMyZones } = myZonesSlice.actions;

export default myZonesSlice.reducer;
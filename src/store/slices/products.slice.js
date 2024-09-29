import { createSlice } from '@reduxjs/toolkit';

export const productsSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    setProducts: (state, action) => {
      return action.payload
    }

  }
})

// export const setProductsThunk = (sheyla_url, token) => async(dispatch) =>{
//   dispatch(setIsLoading(true))
//   await axios.get(`${sheyla_url}/products/`, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   .then( response => {
//     dispatch(setProducts(response.data.data))
//     dispatch(setRenderProducts(response.data.data.slice(0,5)))
//     dispatch(setTotalPage(Math.ceil(response.data.data.length / 5)))
//     dispatch(setIsLoading(false))
//   } )
//   .catch( error => console.log( error ) )
// }

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;
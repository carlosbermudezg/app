import { configureStore } from '@reduxjs/toolkit'
import productsSlice from './slices/products.slice'
import userDataSlice from './slices/userData.slice'
import isAuthSlice from './slices/isAuth.slice'
import isDrawerOpenSlice from './slices/isDrawerOpen.slice'

export const store = configureStore({
    reducer: {
          products: productsSlice,
          userData: userDataSlice,
          isAuth: isAuthSlice,
          isDrawerOpen : isDrawerOpenSlice
      }
})
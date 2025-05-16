import { configureStore } from '@reduxjs/toolkit'
import productsSlice from './slices/products.slice'
import userDataSlice from './slices/userData.slice'
import isDrawerOpenSlice from './slices/isDrawerOpen.slice'
import selectedZoneSlice from './slices/selectedZone.slice'
import isZoneSelectorOpenSlice from './slices/isZoneSelectorOpen.slice'
import myZonesSlice from './slices/myZones.slice'

export const store = configureStore({
    reducer: {
          products: productsSlice,
          userData: userDataSlice,
          isDrawerOpen : isDrawerOpenSlice,
          selectedZone : selectedZoneSlice,
          isZoneSelectorOpen : isZoneSelectorOpenSlice,
          myZones : myZonesSlice
      }
})
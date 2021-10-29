import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    changed: false,
  },
  // Remember that reducers MUST be side-effect-free, synchronous functions
  // That means we CANNOT send http requests from reducers
  // Bear in mind that as we're using a "dumb" backend, we need to handle any database changes in the front-end before submitting to the backend
  // In an application (such as a Rails app) where we can do the logic on the backend and fetch the result, we would not do this here
  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      state.totalQuantity++;
      state.changed = true;
      if (!existingItem) {
        state.items.push({ // This (mutating the state) is ok with Redux Toolkit (it wouldn't be with just Redux)
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++; // '++' just means +1, so this is equivalent to 'existingItem.quantity = existingItem.quantity + 1'
        existingItem.totalPrice = existingItem.totalPrice + newItem.price
      };
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      state.totalQuantity--;
      state.changed = true;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id); // Keep all items that are not equal to 'id'
      } else {
        existingItem.quantity--; // '--' just means -1, so this is equivalent to 'existingItem.quantity = existingItem.quantity - 1'
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      };
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;

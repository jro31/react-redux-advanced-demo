import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      state.totalQuantity++;
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

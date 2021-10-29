import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const fetchCartData = () => { // Another function that returns a function
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch('https://react-http-94026-default-rtdb.europe-west1.firebasedatabase.app/cart.json');

      if (!response.ok) {
        throw new Error('Could not fetch cart data!')
      };

      const data = await response.json();

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(cartActions.replaceCart({
        items: cartData.items || [], // This update is to fix a bug where if there are no items in the cart, we return an empty array instead of 'undefined' (which threw an error in 'const existingItem = state.items.find(item => item.id === newItem.id);' of 'cart-slice.js')
        totalQuantity: cartData.totalQuantity,
      }));
    } catch (error) {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: 'Fetching cart data failed!',
      }));
    };
  }
}

export const sendCartData = (cart) => { // A function that returns a function
  return async (dispatch) => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data!',
    }));

    const sendRequest = async () => {
      const response = await fetch('https://react-http-94026-default-rtdb.europe-west1.firebasedatabase.app/cart.json', {
        method: 'PUT',
        body: JSON.stringify({ items: cart.items, totalQuantity: cart.totalQuantity }),
      });

      if (!response.ok) {
        throw new Error('Sending cart data failed')
      };
    };

    try {
      await sendRequest();

      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!',
      }));
    } catch (error) {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: 'Sending cart data failed!',
      }));
      // My note - Should we also call 'fetchCartData' here?
      // Seems that this 'sendCartData' function will only be called after the redux state is updated
      // So if the backend update is unsuccessful, surely the backend database, and what we're displaying on the front-end would be out of sync
    }
  };
};

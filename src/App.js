import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { uiActions } from './store/ui-slice';
import Notification from './components/UI/Notification';

let isInitial = true; // As this is set outside of the 'App' component, it will not be reinitialised when 'App' is re-executed

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => { // This is in a function because we cannot use async/await directly on 'useEffect()'
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      }));
      const response = await fetch('https://react-http-94026-default-rtdb.europe-west1.firebasedatabase.app/cart.json', {
        method: 'PUT', // We use 'PUT' so that the existing cart is overwritten with the new cart ('POST' would create a new cart each time without removing the existing one)
        body: JSON.stringify(cart),
      });

      if (!response.ok) {
        throw new Error('Sending cart data failed')
      };

      dispatch(uiActions.showNotification({
        status: 'success', // Should be 'success', because 'success' is used in 'Notification.js' to adjust the css classes
        title: 'Success!',
        message: 'Sent cart data successfully!',
      }));
    }

    if (isInitial) { // This prevents the 'sendCartData()' function from being called (and hence the 'PUT' request to the backend being sent) as the page loads for the first time
      isInitial = false;
      return;
    };
    // Note that as we're still not fetching the data from the backend, the cart will still be empty if the page is refreshed

    sendCartData().catch(error => { // As 'sendCartData()' returns a promise, we can call 'catch()' on it
      dispatch(uiActions.showNotification({
        status: 'error', // Should be 'error', because 'error' is used in 'Notification.js' to adjust the css classes
        title: 'Error!',
        message: 'Sending cart data failed!',
      }));
    });
  }, [cart, dispatch]); // 'dispatch' will never change, so it will never trigger this effect to re-run. However, to keep the linter happy, added it as a dependency here.

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

function App() {
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  // 'useSelector()' sets-up a subscription to redux, so whenever our store changes, this (App) component re-executes, and we get the latest state
  // (this logic could obviously be put in any component; it doesn't have to be in 'App')
  // And because we've added 'cart' as a dependency to the 'useEffect()' function (below), that 'useEffect()' function will be re-executed whenever the cart changes
  // So the order in which things take place here is:
  // 1) We update our Redux store, then once that update has finished
  // 2) We select the updated cart and send the request to the backend (below)

  useEffect(() => {
    fetch('https://react-http-94026-default-rtdb.europe-west1.firebasedatabase.app/cart.json', {
      method: 'PUT', // We use 'PUT' so that the existing cart is overwritten with the new cart ('POST' would create a new cart each time without removing the existing one)
      body: JSON.stringify(cart),
    });
  }, [cart]);
  // Be aware of one issue (to be fixed later):
  // This 'useEffect()' function executes when our app starts
  // Therefore it sends an initial (empty) cart to the backend, and overwrites the data stored there
  // So anytime we refresh the page, we still start with an empty cart

  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;

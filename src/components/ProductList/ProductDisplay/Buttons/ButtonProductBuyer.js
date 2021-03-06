/* eslint-disable no-underscore-dangle */
// Mosule imports
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faHeart, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartAlt } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Asset imports
import Loading from 'assets/js/loading.js';

// Action imports
import { userUpdate } from '../../../../redux/actions/users.js';

const ButtonProductBuyer = (props) => {
  const ifSaved = (productID, saved) => saved.map(({ _id }) => _id).includes(productID);
  const ifInCart = (productID, cart) => cart.map(({ _id }) => _id).includes(productID);

  const INIT = {
    save: ifSaved(props.product._id, (props.user && props.user.saved) || []) ? faHeart : faHeartAlt,
    cart: ifInCart(props.product._id, (props.user && props.user.cart) || [])
      ? faShoppingBag
      : faCartPlus
  };

  const [saveIcon, setSaveIcon] = useState(INIT.save);
  const [cartIcon, setCartIcon] = useState(INIT.cart);

  const shouldWishlist = (id, product, saved, email) => {
    const newSaved = ifSaved(id, saved)
      ? saved.filter(({ _id }) => _id !== id)
      : [...saved, product];
    const successMessage = ifSaved(id, saved)
      ? 'Product removed from saved items'
      : 'Product added to saved items';

    setSaveIcon(<Loading variant="primary-benshada" />);

    props
      .userUpdate(email, { saved: newSaved }, successMessage)
      .finally(() => setSaveIcon(INIT.save));
  };

  const shouldAddToCart = (id, product, cart, email) => {
    const newCart = ifInCart(id, cart) ? cart.filter(({ _id }) => _id !== id) : [...cart, product];
    const successMessage = ifInCart(id, cart)
      ? 'Product removed from cart'
      : 'Product added to cart';

    setCartIcon(<Loading variant="primary-benshada" />);

    props
      .userUpdate(email, { cart: newCart }, successMessage)
      .finally(() => setCartIcon(INIT.cart));
  };

  const { product, user, isSignedIn } = props;
  const saved = (user && user.saved) || [];
  const cart = (user && user.cart) || [];
  const email = user && user.email;

  const { _id, quantity } = product;
  const history = useHistory();

  return quantity > 0 ? (
    <>
      <button
        className={`btn bg-white text-${
          ifInCart(_id, cart) ? 'primary-benshada' : 'secondary'
        } rounded-circle pointer`}
        onClick={() => (!isSignedIn ? history.push('/login') : shouldAddToCart(_id, product, cart, email))
        }
      >
        {cartIcon === INIT.cart ? <FontAwesomeIcon icon={cartIcon} /> : cartIcon}
      </button>
      <button
        className={`btn bg-white text-${
          ifSaved(_id, saved) ? 'danger' : 'secondary'
        } rounded-circle pointer`}
        onClick={() => (!isSignedIn ? history.push('/login') : shouldWishlist(_id, product, saved, email))
        }
      >
        {saveIcon === INIT.save ? <FontAwesomeIcon icon={saveIcon} /> : saveIcon}
      </button>
    </>
  ) : (
    ''
  );
};

const mapStateToProps = ({ auth }) => ({ isSignedIn: auth.isSignedIn });

ButtonProductBuyer.propTypes = {
  product: PropTypes.object,
  user: PropTypes.object,
  userUpdate: PropTypes.func,
  isSignedIn: PropTypes.bool
};

export default connect(mapStateToProps, { userUpdate })(ButtonProductBuyer);

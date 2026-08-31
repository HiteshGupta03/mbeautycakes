import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  /* =========================================
     CART TOTAL
  ========================================= */

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  return (
    <section className="cart-section">

      <h2>🛒 Your Cart</h2>


      {/* =========================================
          EMPTY CART
      ========================================= */}

      {cart.length === 0 ? (
        <div className="empty-cart">

          <p>
            Your cart is empty.
          </p>

          <Link to="/cakes">
            🍰 Continue Shopping
          </Link>

        </div>
      ) : (
        <>

          {/* =========================================
              CART ITEMS
          ========================================= */}

          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={
                  item.cartItemId ||
                  `${item.id}-${item.weight || "default"}`
                }
              >

                <div className="cart-item-info">

                  {/* Cake Name */}

                  <h3>
                    {item.name}
                  </h3>


                  {/* Selected Weight */}

                  {item.weight && (
                    <p className="cart-item-weight">
                      Weight:{" "}
                      <strong>
                        {item.weight}
                      </strong>
                    </p>
                  )}


                  {/* Price */}

                  <p>
                    ₹
                    {Number(item.price || 0).toFixed(
                      2
                    )}{" "}
                    each
                  </p>


                  {/* =================================
                      QUANTITY
                  ================================= */}

                  <div className="quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.cartItemId
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.cartItemId
                        )
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* =================================
                      REMOVE
                  ================================= */}

                  <button
                    type="button"
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(
                        item.cartItemId
                      )
                    }
                  >
                    Remove
                  </button>

                </div>


                {/* =================================
                    ITEM TOTAL
                ================================= */}

                <strong className="cart-item-total">

                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}

                </strong>

              </div>

            ))}

          </div>


          {/* =========================================
              CART TOTAL
          ========================================= */}

          <div className="cart-total">

            <h3>
              Total: ₹
              {total.toFixed(2)}
            </h3>


            {/* =====================================
                CHECKOUT
            ===================================== */}

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>

          </div>

        </>
      )}

    </section>
  );
}

export default Cart;
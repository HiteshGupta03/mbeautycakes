import { useState } from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

function Checkout() {
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0);


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


  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };


  /* =========================================
     PLACE ORDER
  ========================================= */

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    /* =========================
       VALIDATE DELIVERY DETAILS
    ========================= */

    if (
      !formData.name.trim() ||
      !formData.mobile.trim() ||
      !formData.address.trim() ||
      !formData.pincode.trim()
    ) {
      alert(
        "Please fill all delivery details."
      );
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    /* =========================
       VALIDATE CART
    ========================= */

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            fullName: formData.name,
            mobile: formData.mobile,
            deliveryAddress:
              formData.address,
            pincode: formData.pincode,

            /* =========================
               SEND WEIGHT TOO
            ========================= */

            items: cart.map((item) => ({
              name: item.name,
              weight: item.weight || "500g",
              quantity:
                Number(item.quantity) || 1,
            })),
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.error ||
          data.message ||
          "Failed to place order."
        );
      }


      console.log(
        "Order placed successfully:",
        data
      );


      /* =========================
         SAVE ORDER INFORMATION
      ========================= */

      setOrderId(data.orderId);

      setPlacedOrderTotal(
        Number(data.totalAmount || total)
      );


      /* =========================
         SUCCESS
      ========================= */

      setOrderPlaced(true);


      /* =========================
         CLEAR CART
      ========================= */

      clearCart();

    } catch (error) {

      console.error(
        "Order error:",
        error
      );

      alert(
        error.message ||
        "Failed to place order. Please try again."
      );
    }
  };


  /* =========================================
     SUCCESS SCREEN
  ========================================= */

  if (orderPlaced) {
    return (
      <section className="checkout-section">

        <div className="order-success">

          <h1>
            🎉 Order Placed Successfully!
          </h1>

          <p>
            Thank you,{" "}
            <strong>
              {formData.name}
            </strong>
            !
          </p>

          <p>
            Your delicious cakes from{" "}
            <strong>
              MbeautyCakes
            </strong>{" "}
            are being prepared.
          </p>

          <p>
            Delivery will be made to:
          </p>

          <p>
            {formData.address}
          </p>

          <p>
            Order ID:{" "}
            <strong>
              #{orderId}
            </strong>
          </p>

          <h2>
            Order Total: ₹
            {Number(
              placedOrderTotal
            ).toFixed(2)}
          </h2>

          <Link
            to="/cakes"
            className="continue-shopping-button"
          >
            🍰 Continue Shopping
          </Link>

        </div>

      </section>
    );
  }


  /* =========================================
     CHECKOUT PAGE
  ========================================= */

  return (
    <section className="checkout-section">

      <button
        type="button"
        className="back-button"
        onClick={() =>
          window.history.back()
        }
      >
        ← Back to Cart
      </button>


      <h1>
        🧾 Checkout
      </h1>


      <div className="checkout-container">


        {/* =====================================
            DELIVERY DETAILS
        ===================================== */}

        <div className="delivery-card">

          <h2>
            Delivery Details
          </h2>

          <form
            onSubmit={handlePlaceOrder}
          >

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />


            <label>
              Mobile Number
            </label>

            <input
              type="tel"
              name="mobile"
              placeholder="Enter your 10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);

                setFormData((currentData) => ({
                  ...currentData,
                  mobile: value,
                }));
              }}
              inputMode="numeric"
              maxLength="10"
              pattern="[0-9]{10}"
              required
            />


            <label>
              Delivery Address
            </label>

            <textarea
              name="address"
              placeholder="Enter your complete delivery address"
              value={formData.address}
              onChange={handleChange}
            />


            <label>
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              placeholder="Enter your 6-digit pincode"
              value={formData.pincode}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

                setFormData((currentData) => ({
                  ...currentData,
                  pincode: value,
                }));
              }}
              inputMode="numeric"
              maxLength="6"
              pattern="[0-9]{6}"
              required
            />

          </form>

        </div>


        {/* =====================================
            ORDER SUMMARY
        ===================================== */}

        <div className="order-summary">

          <h2>
            Order Summary
          </h2>


          {cart.map((item) => (

            <div
              className="summary-item"
              key={
                item.cartItemId ||
                `${item.id}-${item.weight}`
              }
            >

              <div>

                <h3>
                  {item.name}
                </h3>


                {item.weight && (
                  <p>
                    Weight:{" "}
                    <strong>
                      {item.weight}
                    </strong>
                  </p>
                )}


                <p>
                  ₹
                  {Number(
                    item.price || 0
                  ).toFixed(2)}
                  {" × "}
                  {item.quantity}
                </p>

              </div>


              <strong>
                ₹
                {(
                  Number(item.price || 0) *
                  Number(item.quantity || 0)
                ).toFixed(2)}
              </strong>

            </div>

          ))}


          {/* =================================
              TOTAL
          ================================= */}

          <div className="summary-total">

            <h2>
              Total
            </h2>

            <h2>
              ₹{total.toFixed(2)}
            </h2>

          </div>


          {/* =================================
              PLACE ORDER
          ================================= */}

          <button
            type="button"
            className="place-order-button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>

          

        </div>

      </div>

    </section>
  );
}

export default Checkout;
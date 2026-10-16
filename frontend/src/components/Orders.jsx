import { useEffect, useState } from "react";
import "./Orders.css";

function getInitialAuth() {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return { user: null, error: "Please login to view your orders." };
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user?.id) {
      return { user: null, error: "Invalid user information." };
    }
    return { user, error: "" };
  } catch {
    return { user: null, error: "Invalid user information." };
  }
}

function Orders() {
  const [auth] = useState(getInitialAuth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(() => !auth.error);
  const [error, setError] = useState(() => auth.error);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // =========================
  // Get all orders
  // =========================

  useEffect(() => {
    if (!auth.user) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch("/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Orders error:", err);
        setError("Unable to load orders.");
        setLoading(false);
      });
  }, [auth.user]);

  // =========================
  // Get single order details
  // =========================

  const viewOrderDetails = async (orderId) => {
  setDetailsLoading(true);

  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first.");
      return;
    }

    const user = JSON.parse(storedUser);

if (!user.id) {
  alert("Invalid user information.");
  return;
}

const token = localStorage.getItem("token");

const response = await fetch(
  `/api/orders/${orderId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }

    const data = await response.json();

    setSelectedOrder(data);
  } catch (error) {
    console.error("Order details error:", error);
    alert("Unable to load order details.");
  } finally {
    setDetailsLoading(false);
  }
};

  // =========================
  // Order Tracking
  // =========================

  const trackingSteps = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const getStatusIndex = (status) => {
    return trackingSteps.indexOf(status);
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <section className="orders-page">
        <p className="orders-loading">Loading orders...</p>
      </section>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <section className="orders-page">
        <p className="orders-error">{error}</p>
      </section>
    );
  }

  return (
    <section className="orders-page">

  <div className="orders-title-row">
    <h1>📦 Customer Orders</h1>

    <button
      className="refresh-orders-button"
      onClick={() => window.location.reload()}
    >
      🔄 Refresh
    </button>
  </div>

      {/* =========================
          ORDERS
      ========================= */}

      {orders.length === 0 ? (
        <p className="no-orders">
          No orders found.
        </p>
      ) : (
        <div className="orders-container">

          {orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >

              {/* =========================
                  ORDER HEADER
              ========================= */}

              <div className="order-header">

                <h2>
                  Order #{order.id}
                </h2>

                <span className="order-status">
                  {order.status}
                </span>

              </div>

              {/* =========================
                  ORDER INFORMATION
              ========================= */}

              <div className="order-info">

                <p>
                  <strong>Customer:</strong>{" "}
                  {order.full_name}
                </p>

                <p>
                  <strong>Mobile:</strong>{" "}
                  {order.mobile}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {order.delivery_address}
                </p>

                <p>
                  <strong>Pincode:</strong>{" "}
                  {order.pincode}
                </p>

                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(
                    order.created_at
                  ).toLocaleString()}
                </p>

                <p className="order-total">
                  Total: ₹
                  {Number(order.total_amount).toFixed(2)}
                </p>

              </div>

              {/* =========================
                  VIEW DETAILS BUTTON
              ========================= */}

              <button
                className="view-details-button"
                onClick={() =>
                  viewOrderDetails(order.id)
                }
              >
                👁️ View Details
              </button>

            </div>
          ))}

        </div>
      )}

      {/* =========================
          LOADING ORDER DETAILS
      ========================= */}

      {detailsLoading && (
        <div className="order-details">
          <p className="orders-loading">
            Loading order details...
          </p>
        </div>
      )}

      {/* =========================
          ORDER DETAILS
      ========================= */}

      {selectedOrder && !detailsLoading && (
        <div className="order-details">

          <h2>
            🧾 Order #{selectedOrder.order.id} Details
          </h2>

          {/* =========================
              CUSTOMER DETAILS
          ========================= */}

          <div className="customer-details">

            <p>
              <strong>Customer:</strong>{" "}
              {selectedOrder.order.full_name}
            </p>

            <p>
              <strong>Mobile:</strong>{" "}
              {selectedOrder.order.mobile}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {selectedOrder.order.delivery_address}
            </p>

            <p>
              <strong>Pincode:</strong>{" "}
              {selectedOrder.order.pincode}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedOrder.order.status}
            </p>

          </div>

          {/* =========================
    ORDER TRACKING
========================= */}

<div className="order-tracking">

  <h3>🚚 Order Tracking</h3>

  {selectedOrder.order.status === "Cancelled" ? (
    <div className="cancelled-order">
      <span>✕</span>
      <div>
        <strong>Order Cancelled</strong>
        <p>
          This order has been cancelled.
        </p>
      </div>
    </div>
  ) : (
    <div className="tracking-steps">

      {trackingSteps.map((step, index) => {

        const currentIndex = getStatusIndex(
          selectedOrder.order.status
        );

        const isCompleted =
          index < currentIndex;

        const isCurrent =
          index === currentIndex;

        return (
          <div
            className={`tracking-step ${
              isCompleted ? "completed" : ""
            } ${
              isCurrent ? "current" : ""
            }`}
            key={step}
          >

            <div className="tracking-marker">
              {isCompleted || isCurrent ? "✓" : index + 1}
            </div>

            <div className="tracking-content">
              <strong>{step}</strong>

              <span>
                {isCurrent
                  ? "Current status"
                  : isCompleted
                  ? "Completed"
                  : "Pending"}
              </span>
            </div>

          </div>
        );
      })}

    </div>
  )}

</div>

          {/* =========================
              CAKES ORDERED
          ========================= */}

          <div className="cakes-ordered">

            <h3>🍰 Cakes Ordered</h3>

            {selectedOrder.items.map((item) => (
              <div
                className="order-item"
                key={item.id}
              >

                <span className="order-item-name">
                  {item.cake_name}
                  {item.weight ? ` (${item.weight})` : ""}
                </span>

                <span className="order-item-price">
                  ₹{Number(item.price).toFixed(2)} ×{" "}
                  {item.quantity}
                </span>

                <strong>
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </strong>

              </div>
            ))}

          </div>

          {/* =========================
              TOTAL
          ========================= */}

          <div className="details-total">

            <span>
              Total Amount
            </span>

            <span>
              ₹
              {Number(
                selectedOrder.order.total_amount
              ).toFixed(2)}
            </span>

          </div>

          {/* =========================
              CLOSE BUTTON
          ========================= */}

          <button
            className="close-details-button"
            onClick={() => setSelectedOrder(null)}
          >
            ✖ Close
          </button>

        </div>
      )}

    </section>
  );
}

export default Orders;
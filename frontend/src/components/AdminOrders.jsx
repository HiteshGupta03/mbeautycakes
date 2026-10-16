import { useEffect, useState } from "react";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ============================
  // CHECK ADMIN ACCESS
  // ============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/";
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "admin") {
      window.location.href = "/";
    }
  }, []);

  // ============================
  // FETCH ALL ORDERS
  // ============================
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Admin orders error:", error);
      alert("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchOrders();
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        if (!ignore) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Admin orders error:", error);
        if (!ignore) {
          alert("Unable to load orders.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // ============================
  // VIEW ORDER DETAILS
  // ============================
  const viewOrderDetails = async (orderId) => {
    try {
      setDetailsLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/admin/orders/${orderId}`,
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

  // ============================
  // UPDATE ORDER STATUS
  // ============================
  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Failed to update status"
        );
      }

      await fetchOrders();

      if (selectedOrder?.order?.id === orderId) {
        viewOrderDetails(orderId);
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Unable to update order status.");
    }
  };

  // ============================
  // DASHBOARD CALCULATIONS
  // ============================
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "Confirmed"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total_amount || 0),
    0
  );

  // ============================
  // LOADING
  // ============================
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-icon">📦</div>

        <h2>Loading Admin Dashboard...</h2>

        <p>Please wait while we load your orders.</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      {/* ============================
          HEADER
      ============================ */}

      <div className="admin-orders-header">

        <div>
          <div className="admin-label">
            ✦ ADMIN PANEL ✦
          </div>

          <h1>
            📦 Admin Dashboard
          </h1>

          <p>
            Manage customer orders and delivery status
          </p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={handleRefresh}
        >
          🔄 Refresh
        </button>

      </div>


      {/* ============================
          DASHBOARD CARDS
      ============================ */}

      <div className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            📦
          </div>

          <span>Total Orders</span>

          <strong>
            {totalOrders}
          </strong>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            ⏳
          </div>

          <span>Pending</span>

          <strong>
            {pendingOrders}
          </strong>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            ✅
          </div>

          <span>Confirmed</span>

          <strong>
            {confirmedOrders}
          </strong>
        </div>


        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            🚚
          </div>

          <span>Delivered</span>

          <strong>
            {deliveredOrders}
          </strong>
        </div>


        <div className="admin-stat-card revenue-card">
          <div className="admin-stat-icon">
            💰
          </div>

          <span>Total Revenue</span>

          <strong>
            ₹{totalRevenue.toFixed(2)}
          </strong>
        </div>

      </div>


      {/* ============================
          ALL ORDERS
      ============================ */}

      <div className="admin-orders-table-card">

        <div className="admin-section-header">

          <div>
            <div className="admin-section-label">
              ORDER MANAGEMENT
            </div>

            <h2>
              All Orders
            </h2>
          </div>

          <span className="admin-order-count">
            {totalOrders} orders
          </span>

        </div>


        {orders.length === 0 ? (

          <div className="admin-empty">
            <div>🍰</div>

            <h3>No orders found</h3>

            <p>
              Customer orders will appear here.
            </p>
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-orders-table">

              <thead>
                <tr>

                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th>Details</th>

                </tr>
              </thead>


              <tbody>

                {orders.map((order) => (

                  <tr key={order.id}>

                    <td>
                      <span className="admin-order-id">
                        #{order.id}
                      </span>
                    </td>


                    <td>
                      <span className="admin-customer-name">
                        {order.full_name}
                      </span>
                    </td>


                    <td>
                      <span className="admin-contact-info">
                        {order.mobile}
                      </span>
                    </td>


                    <td>
                      <div className="admin-address">
                        {order.delivery_address}

                        <small className="admin-pincode">
                          PIN: {order.pincode}
                        </small>
                      </div>
                    </td>


                    <td>
                      <strong className="admin-order-amount">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </strong>
                    </td>


                    {/* STATUS */}

                    <td>
                      <span
                        className={`admin-status-badge ${
                          order.status === "Pending"
                            ? "admin-status-pending"
                            : order.status === "Confirmed"
                            ? "admin-status-confirmed"
                            : order.status === "Preparing"
                            ? "admin-status-preparing"
                            : order.status === "Out for Delivery"
                            ? "admin-status-out"
                            : order.status === "Delivered"
                            ? "admin-status-delivered"
                            : "admin-status-cancelled"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>


                    {/* UPDATE STATUS */}

                    <td>

                      <select
                        className="admin-status-select"
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Preparing">
                          Preparing
                        </option>

                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>


                    {/* DETAILS */}

                    <td>

                      <button
                        className="admin-view-button"
                        onClick={() =>
                          viewOrderDetails(order.id)
                        }
                      >
                        👁️ View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ============================
          ORDER DETAILS LOADING
      ============================ */}

      {detailsLoading && (

        <div className="admin-order-details">

          <div className="admin-details-loading">
            <div>📦</div>

            <h2>
              Loading order details...
            </h2>
          </div>

        </div>

      )}


      {/* ============================
          ORDER DETAILS
      ============================ */}

      {selectedOrder && !detailsLoading && (

        <div className="admin-order-details">

          <div className="admin-details-header">

            <div>
              <div className="admin-section-label">
                ORDER INFORMATION
              </div>

              <h2>
                📄 Order #
                {selectedOrder.order.id} Details
              </h2>
            </div>

            <span
              className={`admin-status-badge ${
                selectedOrder.order.status === "Pending"
                  ? "admin-status-pending"
                  : selectedOrder.order.status === "Confirmed"
                  ? "admin-status-confirmed"
                  : selectedOrder.order.status === "Preparing"
                  ? "admin-status-preparing"
                  : selectedOrder.order.status === "Out for Delivery"
                  ? "admin-status-out"
                  : selectedOrder.order.status === "Delivered"
                  ? "admin-status-delivered"
                  : "admin-status-cancelled"
              }`}
            >
              {selectedOrder.order.status}
            </span>

          </div>


          {/* CUSTOMER DETAILS */}

          <div className="admin-customer-details">

            <div>
              <span>Customer</span>
              <strong>
                {selectedOrder.order.full_name}
              </strong>
            </div>

            <div>
              <span>Mobile</span>
              <strong>
                {selectedOrder.order.mobile}
              </strong>
            </div>

            <div>
              <span>Address</span>
              <strong>
                {selectedOrder.order.delivery_address}
              </strong>
            </div>

            <div>
              <span>Pincode</span>
              <strong>
                {selectedOrder.order.pincode}
              </strong>
            </div>

          </div>


          {/* CAKES ORDERED */}

          <div className="admin-cakes-ordered">

            <h3>
              🍰 Cakes Ordered
            </h3>

            {selectedOrder.items.map((item) => (

              <div
                key={item.id}
                className="admin-order-item"
              >

                <span className="admin-order-item-name">
                  {item.cake_name}
                  {item.weight ? ` (${item.weight})` : ""}
                </span>

                <span className="admin-order-item-price">
                  ₹{Number(item.price).toFixed(2)}
                  {" × "}
                  {item.quantity}
                </span>

                <strong className="admin-order-item-total">
                  ₹
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </strong>

              </div>

            ))}

          </div>


          {/* TOTAL */}

          <div className="admin-details-total">

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


          {/* CLOSE */}

          <button
            className="admin-close-button"
            onClick={() =>
              setSelectedOrder(null)
            }
          >
            ✖ Close
          </button>

        </div>

      )}

    </div>
  );
}

export default AdminOrders;
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();


const app = express();

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

console.log("AUTHENTICATED USER:", req.user);

next();

  } catch (error) {

    return res.status(403).json({
      message: "Invalid or expired token",
    });

  }
};

const requireAdmin = (req, res, next) => {

  console.log("ADMIN CHECK:", req.user);

  if (req.user.role !== "admin") {
    console.log("❌ ADMIN CHECK FAILED. ROLE:", req.user.role);

    return res.status(403).json({
      message: "Admin access required",
    });
  }

  console.log("✅ ADMIN CHECK PASSED");

  next();
};

// =========================
// MySQL Connection Pool
// =========================

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// =========================
// Test MySQL Connection
// =========================

db.getConnection()
  .then((connection) => {
    console.log("✅ MySQL connection successful!");
    connection.release();
  })
  .catch((error) => {
    console.error(
      "❌ MySQL connection failed:",
      error.message
    );
  });

// =========================
// Home API
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "MbeautyCakes Backend is running!",
  });
});

// =========================
// GET all cakes
// =========================

app.get("/api/cakes", async (req, res) => {
  try {
    const [cakes] = await db.query(
      "SELECT * FROM cakes ORDER BY id ASC"
    );

    res.json(cakes);

  } catch (error) {
    console.error("Get cakes error:", error);

    res.status(500).json({
      message: "Failed to fetch cakes",
      error: error.message,
    });
  }
});

// =========================
// GET single order
// =========================
// =========================
// GET SINGLE ORDER DETAILS
// =========================
app.get(
  "/api/orders/my-orders",
  authenticateToken,
  async (req, res) => {

    let connection;

    try {
      connection = await db.getConnection();

      const [orders] = await connection.execute(
        `
        SELECT
          id,
          user_id,
          full_name,
          mobile,
          delivery_address,
          pincode,
          total_amount,
          status,
          created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY id DESC
        `,
        [req.user.id]
      );

      res.json(orders);

    } catch (error) {
      console.error("My orders error:", error);

      res.status(500).json({
        message: "Failed to fetch orders",
        error: error.message,
      });

    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
);

app.get(
  "/api/orders/:id",
  authenticateToken,
  async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get the order
    const [orders] = await db.query(
      `SELECT *
       FROM orders
       WHERE id = ?
       AND user_id = ?`,
      [id, user_id]
    );

    // Order not found
    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Get order items with weight
    const [items] = await db.query(
      `SELECT
         id,
         order_id,
         cake_name,
         weight,
         price,
         quantity
       FROM order_items
       WHERE order_id = ?
       ORDER BY id ASC`,
      [id]
    );

    // Send order + items
    res.json({
      order: orders[0],
      items: items,
    });

  } catch (error) {
    console.error("Get single order error:", error);

    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// ============================
// GET ADMIN SINGLE ORDER
// ============================

app.get(
  "/api/admin/orders/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
  try {
    const { id } = req.params;

    // Get order information
    const [orders] = await db.query(
      `
      SELECT
        id,
        user_id,
        full_name,
        mobile,
        delivery_address,
        pincode,
        total_amount,
        status,
        created_at
      FROM orders
      WHERE id = ?
      `,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Get cakes belonging to this order with weight
    const [items] = await db.query(
      `
      SELECT
        id,
        order_id,
        cake_name,
        weight,
        price,
        quantity
      FROM order_items
      WHERE order_id = ?
      `,
      [id]
    );

    res.json({
      order: orders[0],
      items: items,
    });

  } catch (error) {
    console.error("Admin order details error:", error);

    res.status(500).json({
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
});

// =========================
// UPDATE ORDER STATUS
// =========================

app.patch(
  "/api/orders/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    // Validate status
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Check if order exists
    const [orders] = await db.query(
      "SELECT id FROM orders WHERE id = ?",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Update status
    await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({
      message: "Order status updated successfully",
      orderId: id,
      status: status,
    });

  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// =========================
// CREATE ORDER
// =========================

app.post("/api/orders", authenticateToken, async (req, res) => {

  const {
    fullName,
    mobile,
    deliveryAddress,
    pincode,
    items,
  } = req.body;

  const userId = req.user.id;

  // =========================
  // Check customer details
  // =========================

  if (
    !fullName ||
    !mobile ||
    !deliveryAddress ||
    !pincode
  ) {
    return res.status(400).json({
      message: "Please fill all delivery details.",
    });
  }

  // =========================
  // Check cart
  // =========================

  if (!items || items.length === 0) {
    return res.status(400).json({
      message: "Your cart is empty.",
    });
  }


  let connection;

  try {

    // =========================
    // Get MySQL connection
    // =========================

    connection = await db.getConnection();


    // =========================
    // Start transaction
    // =========================

    await connection.beginTransaction();


    let totalAmount = 0;

    const orderItems = [];


    // =========================
    // Check each cake
    // =========================

    for (const item of items) {

  /* =========================
     VALIDATE WEIGHT
  ========================= */

  const weight = item.weight || "500g";

  const allowedWeights = [
    "250g",
    "500g",
    "1Kg",
  ];

  if (!allowedWeights.includes(weight)) {
    throw new Error(
      `Invalid weight for ${item.name}`
    );
  }


  /* =========================
     GET CAKE
  ========================= */

  const [rows] =
    await connection.execute(
      `
      SELECT
        id,
        name,
        price,
        price_250g,
        price_1kg
      FROM cakes
      WHERE name = ?
      `,
      [item.name]
    );


  if (rows.length === 0) {
    throw new Error(
      `Cake not found: ${item.name}`
    );
  }


  const cake = rows[0];


  /* =========================
     SELECT PRICE BY WEIGHT
  ========================= */

  let price;

  if (weight === "250g") {

    price = Number(
      cake.price_250g
    );

  } else if (weight === "1Kg") {

    price = Number(
      cake.price_1kg
    );

  } else {

    // Existing price = 500g
    price = Number(
      cake.price
    );
  }


  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    throw new Error(
      `Invalid price for ${item.name} (${weight})`
    );
  }


  /* =========================
     QUANTITY
  ========================= */

  const quantity =
    Number(item.quantity);


  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    throw new Error(
      `Invalid quantity for ${item.name}`
    );
  }


  /* =========================
     ITEM TOTAL
  ========================= */

  const itemTotal =
    price * quantity;

  totalAmount += itemTotal;


  /* =========================
     STORE ORDER ITEM
  ========================= */

  orderItems.push({
    name: cake.name,
    weight: weight,
    price: price,
    quantity: quantity,
  });

}


    // =========================
    // Create order
    // =========================

    const [orderResult] = await connection.execute(

      `INSERT INTO orders
      (
        user_id,
        full_name,
        mobile,
        delivery_address,
        pincode,
        total_amount,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,

      [
        userId,
        fullName,
        mobile,
        deliveryAddress,
        pincode,
        totalAmount,
        "Pending",
      ]

    );


    const orderId = orderResult.insertId;


    // =========================
    // Create order items
    // =========================

    for (const item of orderItems) {

      await connection.execute(
  `
      INSERT INTO order_items
      (
        order_id,
        cake_name,
        weight,
        price,
        quantity
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        orderId,
        item.name,
        item.weight,
        item.price,
        item.quantity,
      ]
    );

    }


    // =========================
    // Save everything
    // =========================

    await connection.commit();


    // =========================
    // Send success response
    // =========================

    res.status(201).json({

      message: "Order placed successfully!",

      orderId: orderId,

      totalAmount: totalAmount,

    });


  } catch (error) {

    // =========================
    // Rollback if error
    // =========================

    if (connection) {

      await connection.rollback();

    }


    console.error(
      "Order error:",
      error
    );


    res.status(500).json({

      message: "Failed to place order.",

      error: error.message,

    });


  } finally {

    // =========================
    // Release connection
    // =========================

    if (connection) {

      connection.release();

    }

  }

});

// =========================
// Register User
// =========================

app.post("/api/register", async (req, res) => {

  const {
    name,
    userId,
    email,
    password,
  } = req.body;


  // =========================
  // Check required fields
  // =========================

  if (!name || !userId || !email || !password) {

    return res.status(400).json({
      message: "Please fill all fields.",
    });

  }


  let connection;

  try {

    // Get MySQL connection

    connection = await db.getConnection();


    // =========================
    // Check existing user
    // =========================

    const [existingUsers] =
      await connection.execute(
        "SELECT id, user_id, email FROM users WHERE user_id = ? OR email = ?",
        [userId, email]
      );

    if (existingUsers.length > 0) {
      const match = existingUsers[0];
      if (match.user_id === userId) {
        return res.status(409).json({
          message: "User ID already registered.",
        });
      }
      return res.status(409).json({
        message: "Email already registered.",
      });
    }


    // =========================
    // Hash password
    // =========================

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // =========================
    // Insert user
    // =========================

    const [result] =
      await connection.execute(

        `INSERT INTO users
        (name, user_id, email, password)
        VALUES (?, ?, ?, ?)`,

        [
          name,
          userId,
          email,
          hashedPassword,
        ]

      );


    res.status(201).json({

      message:
        "Account created successfully!",

      userId: result.insertId,

    });


  } catch (error) {

    console.error(
      "Register error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to create account.",

      error: error.message,

    });


  } finally {

    if (connection) {

      connection.release();

    }

  }

});

// =========================
// Login User
// =========================

app.post("/api/login", async (req, res) => {

  const {
    userId,
    password,
  } = req.body;


  // =========================
  // Check fields
  // =========================

  if (!userId || !password) {

    return res.status(400).json({
      message:
        "Please enter user ID and password.",
    });

  }


  let connection;

  try {

    connection =
      await db.getConnection();


    // =========================
    // Find user by user ID
    // =========================

    const [users] =
      await connection.execute(

        `SELECT
          id,
          name,
          user_id,
          email,
          password AS db_password,
          role AS db_role
        FROM users
        WHERE user_id = ?`,

        [userId]

      );

      console.log("RAW USERS:", users);


    if (users.length === 0) {

      return res.status(401).json({
        message:
          "Invalid user ID or password.",
      });

    }


    const user = users[0];

    console.log("USER FROM DATABASE:", user);
    console.log("USER KEYS:", Object.keys(user));

    // =========================
    // Compare password
    // =========================
    console.log("Login user ID:", userId);
    console.log("Password received:", !!password);
    console.log("Database password exists:", !!user.db_password);
    console.log("Database password length:", user.db_password?.length);
    console.log("Database role:", user.db_role);

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.db_password
      );


    if (!passwordMatch) {

      return res.status(401).json({
        message:
          "Invalid user ID or password.",
      });

    }


    // =========================
    // Login successful
    // =========================

    const token = jwt.sign(
  {
    id: user.id,
    role: user.db_role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h",
  }
);

console.log("FINAL LOGIN RESPONSE:", {
  id: user.id,
  name: user.name,
  user_id: user.user_id,
  role: user.db_role,
});

res.status(200).json({
  message: "Login successful!",

  token,

  user: {
    id: user.id,
    name: user.name,
    user_id: user.user_id,
    email: user.email,
    role: user.db_role,
  },
});


  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed. Please try again.",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }

});


// =========================
// ADMIN - GET ALL ORDERS
// =========================

app.get("/api/admin/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        id,
        user_id,
        full_name,
        mobile,
        delivery_address,
        pincode,
        total_amount,
        status,
        created_at
      FROM orders
      ORDER BY id DESC
    `);

    res.json(orders);
  } catch (error) {
    console.error("Admin get orders error:", error);

    res.status(500).json({
      message: "Failed to fetch admin orders",
      error: error.message,
    });
  }
});


// =========================
// Start Server
// =========================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Backend running on http://localhost:${PORT}`
  );
});
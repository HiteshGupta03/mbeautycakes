import Footer from "./components/Footer";
import CTA from "./components/CTA";
import Testimonials from "./components/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs";
import HowItWorks from "./components/HowItWorks";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminOrders from "./components/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/categories";
import OurMenu from "./components/OurMenu";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import Register from "./components/Register";
import Login from "./components/Login";
import BestSeller from "./components/BestSeller";
import { CartProvider } from "./components/CartContext";
import Profile from "./components/Profile";

/* =========================================
   HOME PAGE
========================================= */

function Home() {
  return (
    <>
      {/* Hero */}
      <Hero />


      {/* Categories */}
      <div id="categories">
        <Categories />
      </div>


      {/* Our Menu */}
      <div id="our-menu">
        <OurMenu />
      </div>


      {/* Best Sellers */}
      <div id="best-sellers">
        <BestSeller />
      </div>


      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>


      {/* Why Choose Us */}
      <div id="why-us">
        <WhyChooseUs />
      </div>


      {/* Testimonials */}
      <div id="testimonials">
        <Testimonials />
      </div>


      {/* CTA */}
      <CTA />


      {/* Footer */}
      <Footer />
    </>
  );
}


/* =========================================
   APP
========================================= */

function App() {
  return (
    <BrowserRouter>

      <CartProvider>

        {/* Navbar */}
        <Navbar />

        <Routes>

          {/* =========================
              ADMIN
          ========================= */}

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />


          {/* =========================
              HOME
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* =========================
              CAKES / MENU
              Direct menu page
          ========================= */}

          <Route
            path="/cakes"
            element={<OurMenu />}
          />


          {/* =========================
              CART
          ========================= */}

          <Route
            path="/cart"
            element={<Cart />}
          />


          {/* =========================
              CHECKOUT
          ========================= */}

          <Route
            path="/checkout"
            element={<Checkout />}
          />


          {/* =========================
              ORDERS
          ========================= */}

          <Route
            path="/orders"
            element={<Orders />}
          />


          {/* =========================
              REGISTER
          ========================= */}

          <Route
            path="/register"
            element={<Register />}
          />


          {/* =========================
              LOGIN
          ========================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Routes>

      </CartProvider>

    </BrowserRouter>
  );
}

export default App;
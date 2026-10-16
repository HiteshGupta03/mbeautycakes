import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();


export function CartProvider({ children }) {

  /* =========================================
     LOAD CART FROM LOCAL STORAGE
  ========================================= */

  const [cart, setCart] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem("cart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  });


  /* =========================================
     SAVE CART
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);


  /* =========================================
     CREATE UNIQUE CART KEY
     
     Same cake + different weight
     = different cart item
  ========================================= */

  const getCartItemKey = (cake) => {
    return cake.weight
      ? `${cake.id}-${cake.weight}`
      : `${cake.id}-default`;
  };


  /* =========================================
     ADD TO CART
  ========================================= */

  const addToCart = (cake) => {
    setCart((currentCart) => {

      const newCartItemKey =
        getCartItemKey(cake);

      const existingCake =
        currentCart.find(
          (item) =>
            item.cartItemId ===
            newCartItemKey
        );


      /* =========================
         EXISTING ITEM
      ========================= */

      if (existingCake) {

        return currentCart.map(
          (item) =>
            item.cartItemId ===
            newCartItemKey
              ? {
                  ...item,
                  quantity:
                    Number(item.quantity || 0) +
                    1,
                }
              : item
        );
      }


      /* =========================
         NEW ITEM
      ========================= */

      return [
        ...currentCart,

        {
          ...cake,

          quantity: 1,

          // Unique variant ID
          cartItemId:
            newCartItemKey,
        },
      ];
    });
  };


  /* =========================================
     INCREASE QUANTITY
  ========================================= */

  const increaseQuantity = (
    cartItemId
  ) => {

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,

              quantity:
                Number(item.quantity || 0) +
                1,
            }
          : item
      )
    );
  };


  /* =========================================
     DECREASE QUANTITY
  ========================================= */

  const decreaseQuantity = (
    cartItemId
  ) => {

    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.cartItemId ===
          cartItemId
            ? {
                ...item,

                quantity:
                  Number(item.quantity || 0) -
                  1,
              }
            : item
        )
        .filter(
          (item) =>
            Number(item.quantity || 0) >
            0
        )
    );
  };


  /* =========================================
     REMOVE FROM CART
  ========================================= */

  const removeFromCart = (
    cartItemId
  ) => {

    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.cartItemId !==
          cartItemId
      )
    );
  };


  /* =========================================
     CLEAR CART
  ========================================= */

  const clearCart = () => {
    setCart([]);
  };


  /* =========================================
     PROVIDER
  ========================================= */

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


/* =========================================
   USE CART
========================================= */

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
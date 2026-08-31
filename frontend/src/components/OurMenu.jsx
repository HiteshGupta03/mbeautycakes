import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import { useCart } from "./CartContext";

import "./OurMenu.css";


function OurMenu() {

  const { addToCart } = useCart();

  /* =========================================
     URL SEARCH PARAMETERS
  ========================================= */

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const urlCategory =
    searchParams.get("category") || "All";


  /* =========================================
     STATES
  ========================================= */

  const [cakes, setCakes] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState(urlCategory);

  const [selectedWeights, setSelectedWeights] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================================
     FETCH CAKES
  ========================================= */

  useEffect(() => {

    const fetchCakes = async () => {

      try {

        setLoading(true);

        setError("");


        const response = await fetch(
          "/api/cakes"
        );


        if (!response.ok) {

          throw new Error(
            "Failed to fetch cakes"
          );

        }


        const data =
          await response.json();


        setCakes(data);

      } catch (err) {

        console.error(
          "Our Menu error:",
          err
        );

        setError(
          "Unable to load our menu."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchCakes();

  }, []);


  /* =========================================
     SYNC URL CATEGORY WITH SELECTED CATEGORY
  ========================================= */

  useEffect(() => {

    setSelectedCategory(
      urlCategory
    );

  }, [urlCategory]);


  /* =========================================
     CATEGORY LIST
  ========================================= */

  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        cakes
          .map(
            (cake) =>
              cake.category
          )
          .filter(Boolean)
      ),
    ];


    return [
      "All",
      ...uniqueCategories,
    ];

  }, [cakes]);


  /* =========================================
     FILTERED CAKES
  ========================================= */

  const filteredCakes = useMemo(() => {

    if (
      selectedCategory === "All"
    ) {
      return cakes;
    }


    return cakes.filter(
      (cake) =>
        cake.category &&
        cake.category.toLowerCase() ===
          selectedCategory.toLowerCase()
    );

  }, [
    cakes,
    selectedCategory,
  ]);


  /* =========================================
     GET SELECTED WEIGHT
  ========================================= */

  const getSelectedWeight = (
    cakeId
  ) => {

    return (
      selectedWeights[cakeId] ||
      "500g"
    );

  };


  /* =========================================
     GET PRICE
  ========================================= */

  const getCakePrice = (
    cake,
    weight
  ) => {

    if (
      weight === "250g"
    ) {

      return Number(
        cake.price_250g ??
        cake.price
      );

    }


    if (
      weight === "1Kg"
    ) {

      return Number(
        cake.price_1kg ??
        cake.price
      );

    }


    /* =========================
       DEFAULT = 500g
    ========================= */

    return Number(
      cake.price
    );

  };


  /* =========================================
     CHANGE WEIGHT
  ========================================= */

  const handleWeightChange = (
    cakeId,
    weight
  ) => {

    setSelectedWeights(
      (currentWeights) => ({

        ...currentWeights,

        [cakeId]: weight,

      })
    );

  };


  /* =========================================
     CHANGE CATEGORY
  ========================================= */

  const handleCategoryChange = (
    category
  ) => {

    setSelectedCategory(
      category
    );


    /*
      Update URL

      All:
      /cakes

      Chocolate:
      /cakes?category=Chocolate
    */

    if (
      category === "All"
    ) {

      setSearchParams({});

    } else {

      setSearchParams({
        category:
          category,
      });

    }

  };


  /* =========================================
     ADD TO CART
  ========================================= */

  const handleAddToCart = (
    cake
  ) => {

    const selectedWeight =
      getSelectedWeight(
        cake.id
      );


    const selectedPrice =
      getCakePrice(
        cake,
        selectedWeight
      );


    const cartCake = {

      ...cake,


      /* =========================
         SELECTED VARIANT
      ========================= */

      weight:
        selectedWeight,

      price:
        selectedPrice,


      /* =========================
         UNIQUE CART ITEM
      ========================= */

      cartItemId:
        `${cake.id}-${selectedWeight}`,

    };


    addToCart(
      cartCake
    );

  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (

      <section
        className="our-menu"
        id="our-menu"
      >

        <div
          className="our-menu-heading"
        >

          <div
            className="our-menu-label"
          >

            <span>
              ✦
            </span>

            OUR MENU

            <span>
              ✦
            </span>

          </div>


          <h2>

            Freshly Baked

            <span>
              {" "}For You
            </span>

          </h2>


          <p>

            Choose your favorite cake and
            select the perfect size for your
            celebration.

          </p>

        </div>


        <div
          className="our-menu-grid"
        >

          {[1, 2, 3, 4].map(
            (item) => (

              <div
                className="menu-card menu-skeleton"
                key={item}
              >

                <div
                  className="menu-skeleton-image"
                ></div>


                <div
                  className="menu-skeleton-content"
                >

                  <div
                    className="menu-skeleton-line title"
                  ></div>


                  <div
                    className="menu-skeleton-line"
                  ></div>


                  <div
                    className="menu-skeleton-line short"
                  ></div>

                </div>

              </div>

            )
          )}

        </div>

      </section>

    );

  }


  /* =========================================
     ERROR
  ========================================= */

  if (error) {

    return (

      <section
        className="our-menu"
        id="our-menu"
      >

        <div
          className="menu-error"
        >

          <div
            className="menu-error-icon"
          >
            🍰
          </div>


          <h3>
            Something went wrong
          </h3>


          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </section>

    );

  }


  /* =========================================
     MAIN UI
  ========================================= */

  return (

    <section
      className="our-menu"
      id="our-menu"
    >

      {/* =========================
          HEADING
      ========================= */}

      <div
        className="our-menu-heading"
      >

        <div
          className="our-menu-label"
        >

          <span>
            ✦
          </span>

          OUR MENU

          <span>
            ✦
          </span>

        </div>


        <h2>

          Freshly Baked

          <span>
            {" "}For You
          </span>

        </h2>


        <p>

          Explore our delicious collection
          and choose the perfect size for
          every celebration.

        </p>

      </div>


      {/* =========================
          CATEGORY FILTER
      ========================= */}

      <div
        className="menu-filters"
      >

        {categories.map(
          (category) => (

            <button
              type="button"
              key={category}

              className={
                selectedCategory ===
                category
                  ? "menu-filter active"
                  : "menu-filter"
              }

              onClick={() =>
                handleCategoryChange(
                  category
                )
              }
            >

              {category}

            </button>

          )
        )}

      </div>


      {/* =========================
          MENU GRID
      ========================= */}

      {filteredCakes.length === 0 ? (

        <div
          className="menu-empty"
        >

          <div>
            🎂
          </div>


          <h3>
            No cakes available
          </h3>


          <p>
            More delicious cakes are
            coming soon.
          </p>

        </div>

      ) : (

        <div
          className="our-menu-grid"
        >

          {filteredCakes.map(
            (cake) => {

              const selectedWeight =
                getSelectedWeight(
                  cake.id
                );


              const selectedPrice =
                getCakePrice(
                  cake,
                  selectedWeight
                );


              return (

                <article
                  className="menu-card"
                  key={cake.id}
                >

                  {/* =========================
                      IMAGE
                  ========================= */}

                  <div
                    className="menu-image"
                  >

                    <div
                      className="menu-category"
                    >
                      {cake.category}
                    </div>


                    <img
                      src={cake.image}
                      alt={cake.name}
                      loading="lazy"
                    />

                  </div>


                  {/* =========================
                      CONTENT
                  ========================= */}

                  <div
                    className="menu-content"
                  >

                    <h3>
                      {cake.name}
                    </h3>


                    <p
                      className="menu-description"
                    >
                      {cake.description}
                    </p>


                    {/* =========================
                        WEIGHTS
                    ========================= */}

                    <div
                      className="menu-weight-label"
                    >
                      Select Weight
                    </div>


                    <div
                      className="menu-weights"
                    >

                      {[
                        "250g",
                        "500g",
                        "1Kg",
                      ].map(
                        (weight) => (

                          <button
                            type="button"
                            key={weight}

                            className={
                              selectedWeight ===
                              weight
                                ? "weight-option active"
                                : "weight-option"
                            }

                            onClick={() =>
                              handleWeightChange(
                                cake.id,
                                weight
                              )
                            }
                          >

                            {weight}

                          </button>

                        )
                      )}

                    </div>


                    {/* =========================
                        PRICE + CART
                    ========================= */}

                    <div
                      className="menu-bottom"
                    >

                      <div
                        className="menu-price"
                      >

                        <span>
                          Starting from
                        </span>


                        <strong>

                          ₹
                          {selectedPrice.toFixed(
                            0
                          )}

                        </strong>

                      </div>


                      <button
                        type="button"
                        className="menu-cart-button"

                        onClick={() =>
                          handleAddToCart(
                            cake
                          )
                        }
                      >

                        <span>
                          🛒
                        </span>

                        Add to Cart

                      </button>

                    </div>

                  </div>

                </article>

              );

            }
          )}

        </div>

      )}

    </section>

  );

}


export default OurMenu;
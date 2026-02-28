import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingDealer, setLoadingDealer] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [unreviewed, setUnreviewed] = useState(false);

  const { id } = useParams();
  const isLoggedIn = sessionStorage.getItem("username") !== null;

  // ✅ matches your djangoapp/urls.py
  const dealer_url = `/djangoapp/get_dealer_details/${id}`;
  const reviews_url = `/djangoapp/get_dealer_reviews/${id}`;

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  const get_dealer = async () => {
    setLoadingDealer(true);
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const data = await res.json();

      // Your backend returns: {status:200, dealer:{...}}
      if ((data.status === 200 || data.status === "200") && data.dealer) {
        setDealer(data.dealer); // ✅ dealer is an OBJECT
      } else {
        setDealer(null);
      }
    } catch (err) {
      console.error("Error loading dealer details:", err);
      setDealer(null);
    }
    setLoadingDealer(false);
  };

  const get_reviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      const data = await res.json();

      if ((data.status === 200 || data.status === "200") && Array.isArray(data.reviews)) {
        if (data.reviews.length > 0) {
          setReviews(data.reviews);
          setUnreviewed(false);
        } else {
          setReviews([]);
          setUnreviewed(true);
        }
      } else {
        setReviews([]);
        setUnreviewed(true);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
      setUnreviewed(true);
    }
    setLoadingReviews(false);
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div style={{ margin: "20px" }}>
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {loadingDealer ? "Loading dealer..." : dealer ? dealer.full_name : "Dealer"}
          {isLoggedIn ? (
            <Link to={`/postreview/${id}`}>
              <img
                src={review_icon}
                style={{ width: "10%", marginLeft: "10px", marginTop: "10px" }}
                alt="Post Review"
              />
            </Link>
          ) : null}
        </h1>

        {!loadingDealer && dealer ? (
          <h4 style={{ color: "grey" }}>
            {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
          </h4>
        ) : null}
      </div>

      <div className="reviews_panel">
        {loadingReviews ? (
          <p>Loading Reviews....</p>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="review_panel">
              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
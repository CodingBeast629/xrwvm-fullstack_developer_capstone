import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";

const PostReview = () => {
  const [dealer, setDealer] = useState(null);
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const dealer_url = `/djangoapp/get_dealer_details/${id}`;
  const review_url = `/djangoapp/add_review`;
  const carmodels_url = `/djangoapp/get_cars`;

  const postreview = async () => {
    let name =
      (sessionStorage.getItem("firstname") || "") +
      " " +
      (sessionStorage.getItem("lastname") || "");
    name = name.trim();

    if (!name || name.includes("null")) {
      name = sessionStorage.getItem("username") || "";
    }

    if (!model || review.trim() === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    const model_split = model.split(" ");
    const make_chosen = model_split[0] || "";
    const model_chosen = model_split.slice(1).join(" ") || "";

    const jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsoninput,
      });

      const json = await res.json();

      if (json.status === 200) {
        // safest if App.js supports both /dealer/:id and /dealer/:id/
        navigate(`/dealer/${id}`);
      } else {
        alert("Failed to post review. Please try again.");
      }
    } catch (err) {
      console.error("Error posting review:", err);
      alert("Failed to post review. Please try again.");
    }
  };

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();

      if ((retobj.status === 200 || retobj.status === "200") && retobj.dealer) {
        setDealer(retobj.dealer);
      } else {
        setDealer(null);
      }
    } catch (err) {
      console.error("Error getting dealer:", err);
      setDealer(null);
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url, { method: "GET" });
      const retobj = await res.json();

      // Robust to key changes across lab versions
      const list =
        retobj.CarModels ||
        retobj.carModels ||
        retobj.carmodels ||
        retobj.cars ||
        [];

      setCarmodels(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error getting car models:", err);
      setCarmodels([]);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div style={{ margin: "5%" }}>
      <h1 style={{ color: "darkblue" }}>{dealer ? dealer.full_name : "Dealer"}</h1>

      <textarea
        id="review"
        cols="50"
        rows="7"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <div className="input_field">
        Purchase Date{" "}
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="input_field">
        Car Make
        <select
          name="cars"
          id="cars"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="" disabled>
            Choose Car Make and Model
          </option>

          {carmodels.length === 0 ? (
            <option value="" disabled>
              (No car models loaded)
            </option>
          ) : (
            carmodels.map((carmodel, idx) => (
              <option key={idx} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="input_field">
        Car Year{" "}
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          max={2026}
          min={2010}
        />
      </div>

      <div>
        <button className="postreview" onClick={postreview}>
          Post Review
        </button>
      </div>
    </div>
  );
};

export default PostReview;
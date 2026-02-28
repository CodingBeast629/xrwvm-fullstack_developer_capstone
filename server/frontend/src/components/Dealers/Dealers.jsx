import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import review_icon from "../assets/reviewicon.png";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  const dealer_url = "/djangoapp/get_dealers";
  const dealer_url_by_state_base = "/djangoapp/get_dealers/";

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  const filterDealers = async (state) => {
    try {
      // If user chooses "All", reload all dealers
      if (state === "All") {
        await get_dealers();
        return;
      }

      const res = await fetch(dealer_url_by_state_base + state, {
        method: "GET",
      });

      const retobj = await res.json();

      if (retobj.status === 200) {
        const state_dealers = Array.from(retobj.dealers || []);
        setDealersList(state_dealers);
      } else {
        setDealersList([]);
      }
    } catch (err) {
      console.error("Error filtering dealers:", err);
      setDealersList([]);
    }
  };

  const get_dealers = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET",
      });

      const retobj = await res.json();

      if (retobj.status === 200) {
        const all_dealers = Array.from(retobj.dealers || []);

        const stateList = all_dealers.map((d) => d.state).filter(Boolean);
        setStates(Array.from(new Set(stateList)));

        setDealersList(all_dealers);
      } else {
        setStates([]);
        setDealersList([]);
      }
    } catch (err) {
      console.error("Error getting dealers:", err);
      setStates([]);
      setDealersList([]);
    }
  };

  useEffect(() => {
    get_dealers();
  }, []);

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select
                name="state"
                id="state"
                defaultValue=""
                onChange={(e) => filterDealers(e.target.value)}
              >
                <option value="" disabled hidden>
                  State
                </option>
                <option value="All">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </th>
            {isLoggedIn ? <th>Review Dealer</th> : null}
          </tr>
        </thead>

        <tbody>
          {dealersList.map((dealer) => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td>
                <Link to={`/dealer/${dealer.id}`}>{dealer.full_name}</Link>
              </td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn ? (
                <td>
                  <Link to={`/postreview/${dealer.id}`}>
                    <img
                      src={review_icon}
                      className="review_icon"
                      alt="Post Review"
                    />
                  </Link>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
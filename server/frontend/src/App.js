import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Header from "./components/Header/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Dealers list */}
        <Route path="/" element={<Dealers />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/dealers/" element={<Dealers />} />

        {/* Dealer details */}
        <Route path="/dealer/:id" element={<Dealer />} />
        <Route path="/dealer/:id/" element={<Dealer />} />

        {/* Post review */}
        <Route path="/postreview/:id" element={<PostReview />} />
        <Route path="/postreview/:id/" element={<PostReview />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/" element={<Register />} />

        {/* Anything else -> go home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
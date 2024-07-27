import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Default from "./views/Layout/Default";
import Login from "./views/login/Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Default />} />
      </Routes>
    </>
  );
}

export default App;

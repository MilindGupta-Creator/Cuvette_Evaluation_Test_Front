// NotFound.js

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404 - Not Found</h1>
      <p style={styles.text}>Sorry, the page you're looking for does not exist.</p>
      <Link to="/" style={styles.link}>
        Go back to the home page
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "2em",
    color: "#333",
  },
  text: {
    fontSize: "1em",
    color: "#666",
    marginBottom: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
    fontSize: "1em",
  },
};

export default NotFound;

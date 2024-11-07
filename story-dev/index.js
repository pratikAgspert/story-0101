import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("container");
if (container) {
  const root = createRoot(container);

  root.render(
    <p style={{ border: "5px soild red", fontSize: 30, fontWeight: "bold" }}>
      Hello World!
    </p>
  );
}

import React from "react";

const ProductWidget = ({ shopUrl, productId }) => {
  return (
    <div className="story-product-widget">
      <h2>Test Product Story</h2>
      <p>Shop URL: {shopUrl}</p>
      <p>Product ID: {productId || "Not specified"}</p>
    </div>
  );
};

export default ProductWidget;

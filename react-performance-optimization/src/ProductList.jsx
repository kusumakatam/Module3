function ProductList({ products, onProductSelect }) {
  console.log("ProductList rendered");

  return (
    <ul>
      {products.slice(0, 10).map((product) => (
        <li key={product.id}>
          {product.name} - ₹{product.price}
          <button onClick={() => onProductSelect(product)}>
            Select
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ProductList;

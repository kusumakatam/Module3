import { useState, useMemo, useCallback } from "react";
import ProductList from "./ProductList";

const products = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  name: `Product ${index}`,
  price: index + 1,
}));

function App() {
  const [counter, setCounter] = useState(0);

 
  const totalPrice = useMemo(() => {
    console.log("Total price calculated");
    return products.reduce((sum, product) => sum + product.price, 0);
  }, [products]);

  
  const handleProductSelect = useCallback((product) => {
    console.log("Selected product:", product);
  }, []);

  return (
    <div>
      <h1>Total Price: ₹{totalPrice}</h1>

      <button onClick={() => setCounter(counter + 1)}>
        Counter: {counter}
      </button>

      <ProductList
        products={products}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
}

export default App;

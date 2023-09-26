import React, { useState } from 'react';
import './Basket.css';

function Basket({ catalog, deliveryRules, offers }) {
  const [items, setItems] = useState([]);

  // Function that add a product to the basket
  const addItem = (productCode) => {
    const product = catalog.find((item) => item.productCode === productCode);
    if (product) {
      setItems([...items, product]);
    }
  };

  // Function that calculate the total cost of the basket
  const calculateTotal = () => {
    const itemCounts = items.reduce((counts, item) => {
      counts[item.productCode] = (counts[item.productCode] || 0) + 1;
      return counts;
    }, {});

    // Calculate subtotal and apply special offers
    let subtotal = 0;
    for (const product of catalog) {
      const count = itemCounts[product.productCode] || 0;
      subtotal += product.price * count;

      if (product.productCode === 'R01') {
        const offerCount = Math.floor(count / 2);
        subtotal -= offerCount * (product.price / 2);
      }
    }

    let deliveryCharge = 0;
    for (const rule of deliveryRules) {
      if (subtotal < rule.amount) {
        deliveryCharge = rule.charge;
        break;
      }
    }

    return subtotal + deliveryCharge;
  };

  return (
    <div className='basket-container'>
      <h2 className='center'> Basket</h2>
      <ul>
        {items.map((item) => (
          <li key={item.productCode}>
            {item.productCode} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <div className='button-container'>
        <button onClick={() => addItem('R01')}>Add Red Plate (R01)</button>
        <button onClick={() => addItem('G01')}>Add Green Plate (G01)</button>
        <button onClick={() => addItem('B01')}>Add Blue Plate (B01)</button>
      </div>
      <p className='total'>Total: ${calculateTotal().toFixed(2)}</p>
    </div>
  );
}

const productCatalog = [
  { productCode: 'R01', price: 32.95 },
  { productCode: 'G01', price: 24.95 },
  { productCode: 'B01', price: 7.95 },
];

const deliveryRules = [
  { amount: 50, charge: 4.95 },
  { amount: 90, charge: 2.95 },
];

const specialOffers = [
  { productCode: 'R01', offerType: 'buy-one-get-one-half-price' },
];

function App() {
  return (
    <div className='App'>
      <Basket
        catalog={productCatalog}
        deliveryRules={deliveryRules}
        offers={specialOffers}
      />
    </div>
  );
}

export default App;

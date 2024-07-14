import React, { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(null); // Stocker le token dans l'état

  useEffect(() => {
    // Lorsque le composant se monte, vous récupérez le token depuis le stockage local, par exemple
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost/api/carts', {
        headers: {
          'Authorization': `Bearer ${token}` // Utilisation du token dans l'en-tête
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.products);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      // Logique pour supprimer le produit du panier avec productId depuis l'API
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCartItems();
    }
  }, [token]); // Lancer fetchCartItems lorsque le token change

  return (
    <div>
      <h2>Mon Panier</h2>
      <div>
        {cartItems.map((item: CartItem) => (
          <div key={item.id}>
            <p>{item.productId} - Quantité: {item.quantity}</p>
            <button onClick={() => removeFromCart(item.productId)}>Retirer du panier</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;

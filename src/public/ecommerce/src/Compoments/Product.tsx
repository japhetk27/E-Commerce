import React from 'react';


interface ProductProps {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
  };
  onAddToCart: (productId: number) => void;
}

const Product: React.FC<ProductProps> = ({ product, onAddToCart }) => {
  const { id, name, description, image, price } = product;


  return (
    <div className="card">
      <img src={product.image} className="card-img-top img-fluid" alt={product.name} /> {/* Ajoutez la classe img-fluid pour que l'image prenne la largeur de son conteneur */}
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">{price} €</p>
        <button onClick={() => onAddToCart(product.id)}>Ajouter au panier</button>
      </div>
    </div>
  );
};

export default Product;

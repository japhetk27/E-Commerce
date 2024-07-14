import React, { useState, useEffect } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Product from './Product'; // Assurez-vous que le chemin d'importation est correct
import { faUser } from '@fortawesome/free-solid-svg-icons';
import UserProfileModal from './UserProfileModal';

library.add(faShoppingCart);

interface ProductType {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: ''
  });

  useEffect(() => {
    fetchUserProfile();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      await fetch('http://localhost/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newProductName,
          description: newProductDescription,
          image: newProductImage,
          price: newProductPrice
        })
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const editProduct = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost/api/products/${productId}`);
      const data = await response.json();
      setNewProductName(data.name);
      setNewProductDescription(data.description);
      setNewProductImage(data.image);
      setNewProductPrice(data.price);
      setEditingProduct(productId);
    } catch (error) {
      console.error('Error fetching product details for editing:', error);
    }
  };

  const updateProduct = async () => {
    try {
      await fetch(`http://localhost/api/products/${editingProduct}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newProductName,
          description: newProductDescription,
          image: newProductImage,
          price: newProductPrice
        })
      });
      fetchProducts();
      setNewProductName("");
      setNewProductDescription("");
      setNewProductImage("");
      setNewProductPrice(0);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      await fetch(`http://localhost/api/products/${productId}`, {
        method: 'DELETE'
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductName(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductDescription(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductImage(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductPrice(parseFloat(event.target.value));
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const openUserProfile = () => {
    setIsUserProfileOpen(true);
  };

  const closeUserProfile = () => {
    setIsUserProfileOpen(false);
  };


  // cette fonction addToCart bloque 

  const addToCart = async (productId: number) => {
    try {
      const productData = {
        productId: productId,
        // Autres données du produit que vous souhaitez envoyer
      };
  
      const response = await fetch(`http://localhost/api/carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Définir le type de contenu comme JSON
        },
        body: JSON.stringify(productData) // Convertir les données du produit en chaîne JSON
      });
  
      if (response.ok) {
        console.log('Product added to cart successfully');
      } else {
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  
  const updateUserProfile = async (updatedData: { email: string; firstname: string; lastname: string }) => {
    try {
      const response = await fetch('http://localhost/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        setUserData({ ...userData, ...updatedData });
        closeUserProfile();
      } else {
        console.error('Failed to update user profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="">Mon Catalogue</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="#"></a>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={openUserProfile}>
                <FontAwesomeIcon icon={faUser} /> Profil
              </button>
            </li>
          </ul>
          <a className='navbar-brand' href='/cart'>
          <FontAwesomeIcon icon={faShoppingCart} size="lg" className="text-white" />
          </a>
        </div>
      </nav>
      <UserProfileModal isOpen={isUserProfileOpen} onClose={closeUserProfile} userData={userData} onUpdate={updateUserProfile} />
      <div style={{ padding: "50px" }}>
        <div className="container" style={{ background: "rgba(173, 216, 230, 0.5)", height: "90%", overflowY: "auto" }}>
          <h2 className="text-center mb-4">Catalogue</h2>
          <div className="mb-4">
            <h3>Ajouter un nouveau produit</h3>
            <div className="row">
              <div className="col-md-3">
                <input type="text" className="form-control mb-2" placeholder="Nom du produit" value={newProductName} onChange={handleNameChange} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control mb-2" placeholder="Description du produit" value={newProductDescription} onChange={handleDescriptionChange} />
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control mb-2" placeholder="URL de l'image du produit" value={newProductImage} onChange={handleImageChange} />
              </div>
              <div className="col-md-2">
                <input type="number" className="form-control mb-2" placeholder="Prix du produit" value={newProductPrice} onChange={handlePriceChange} />
              </div>
              <div className="col-md-1">
                <button className="btn btn-primary" onClick={editingProduct ? updateProduct : addProduct}>
                  {editingProduct ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
          <div className="product-list">
            {products.map(product => (
              <div key={product.id} className="row mb-4">
                <div className="col-md-8">
                <Product product={product} onAddToCart={addToCart} />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-warning mr-2" onClick={() => editProduct(product.id)}>Modifier</button>
                  <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalog;

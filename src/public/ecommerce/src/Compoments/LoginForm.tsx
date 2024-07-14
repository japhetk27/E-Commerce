import React, { useState } from "react";
import { Link,  } from "react-router-dom";

// Styles CSS directement dans le code
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Centrer horizontalement
    alignItems: "center", // Centrer verticalement
    minHeight: "100vh", // Pour que le formulaire prenne toute la hauteur de la vue
    background: "rgba(173, 216, 230, 0.5)", // Couleur de fond semi-transparente bleu ciel sombre
  },
  formContainer: {
    width: "400px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    background: "#f9f9f9",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    boxSizing: "border-box" as "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Stockez le jeton d'authentification dans localStorage ou sessionStorage
        localStorage.setItem("authToken", data.token);
        console.log("Connexion réussie !");
        // Redirigez l'utilisateur vers la page du catalogue une fois connecté
        window.location.href = "/catalog";
      } else {
        console.error("Erreur lors de la connexion :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la requête de connexion :", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="username">
              Username:
            </label>
            <input
              style={styles.input}
              type="username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Mot de passe:
            </label>
            <input
              style={styles.input}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} type="submit">
            Se connecter
          </button>
        </form>
        <p>
          Nouveau sur E-Shop ? <Link to="/register">Inscrivez-vous ici</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useState } from "react";

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
    margin: "auto", // Centre le formulaire horizontalement
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      
      console.log(formData); // Afficher les données du formulaire dans la console

      const response = await fetch("http://localhost/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        username: formData.login, // Utilisez le nom de champ attendu par le backend
        password: formData.password,
        email: formData.email,
        firstname: formData.firstname,
        lastname: formData.lastname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Stockez le token d'authentification dans localStorage ou sessionStorage
        localStorage.setItem("authToken", data.token);
        console.log("Enregistrement réussi !");
        // Redirigez l'utilisateur vers la page du catalogue une fois inscrit
        window.location.href = "/catalog";

      } else {
        console.error("Erreur lors de l'enregistrement :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la requête d'enregistrement :", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2>Inscription</h2>
        <form onSubmit={handleRegister}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="login">
              Login:
            </label>
            <input style={styles.input} type="text" id="login" name="login" value={formData.login} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">
              Mot de passe:
            </label>
            <input style={styles.input} type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email:
            </label>
            <input style={styles.input} type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="firstname">
              Prénom:
            </label>
            <input style={styles.input} type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="lastname">
              Nom:
            </label>
            <input style={styles.input} type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>
          <button style={styles.button} type="submit">
            S'inscrire
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;

# E-Commerce API with Symfony and React

This project aims to create a generic API for e-commerce merchant sites, focusing on selling computer components. The backend is built with Symfony, providing RESTful endpoints, while the frontend is developed using React with TypeScript. Docker is utilized for easy deployment and orchestration of the services.

## Features

- RESTful API adhering to industry standards
- Authentication and authorization using JWT tokens
- CRUD operations for users, products, and orders
- Shopping cart management
- Integration with Stripe for payment processing

## Getting Started

### Prerequisites

- Docker installed on your machine

### Installation

1. Clone this repository:

   ```bash
   git clone https://git@github.com:japhetk27/E-Commerce.git
   ```

2. Navigate to the project directory:

   ```bash
   cd docker
   ```

3. Run Docker Compose to build and start the services:

   ```bash
   docker-compose up --build
   ```

4. Access the backend API at [http://localhost:8000](http://localhost:80) and the frontend at [http://localhost:8080](http://localhost:80).

### Usage

- Register a new user: `POST /api/register`
- Login to obtain authentication token: `POST /api/login`
- Retrieve list of products: `GET /api/products`
- Add a product to the cart: `POST /api/carts/{productId}`
- View shopping cart: `GET /api/carts`
- Checkout and validate cart: `POST /api/carts/validate`
- View user's orders: `GET /api/orders/`

## Development

To run the Symfony backend for development:

```bash
symfony server:start
```

To start the React frontend:

```bash
cd frontend
npm start
```

## Deployment

To deploy the API using Docker, make sure you have Docker installed and run:

```bash
docker-compose up --build -d
```

To test it you will need Postman and join : https://www.postman.com/dark-space-309423/workspace/e-commerce/collection/32635121-fa49abd0-a8c8-44db-afb4-145771ec0711?action=share&creator=32635121

## Built With

- Symfony - Backend framework
- React - Frontend library
- Docker - Containerization and deployment
- Stripe - Payment processing

## Authors

- [Damien Richer](https://github.com/LilCisaille) - Backend development
- [Japhet Kaya](https://github.com/japhetk27) - Frontend development

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to [Symfony](https://symfony.com/) and [React](https://reactjs.org/) communities for their amazing frameworks.

#

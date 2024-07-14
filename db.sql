-- Table to store user information
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "firstname" VARCHAR(255) NOT NULL,
  "lastname" VARCHAR(255) NOT NULL,
  UNIQUE ("username"),
  UNIQUE ("email")
);

-- Table to store product information
CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "image" VARCHAR(255),
  "price" DECIMAL(10, 2) NOT NULL
);

-- Table to store order information
CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "totalPrice" DECIMAL(10, 2) NOT NULL,
  "creationDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "user_id" INT NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

-- Table to store order items
CREATE TABLE "order_items" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INT NOT NULL,
  "product_id" INT NOT NULL,
  "quantity" INT NOT NULL,
  FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
  FOREIGN KEY ("product_id") REFERENCES "product" ("id")
);

-- Table to store shopping cart
CREATE TABLE "cart" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);

-- Table to store cart items
CREATE TABLE "cart_items" (
  "id" SERIAL PRIMARY KEY,
  "cart_id" INT NOT NULL,
  "product_id" INT NOT NULL,
  "quantity" INT NOT NULL,
  FOREIGN KEY ("cart_id") REFERENCES "cart" ("id"),
  FOREIGN KEY ("product_id") REFERENCES "product" ("id")
);
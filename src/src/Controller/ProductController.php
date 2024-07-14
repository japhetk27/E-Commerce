<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\Users;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;


class ProductController extends AbstractController
{
    /**
     * @Route("/api/products", name="api_products", methods={"GET"})
     */
    public function getProducts(): JsonResponse
    {
        // Get the repository for the Product entity
        $productRepository = $this->getDoctrine()->getRepository(Product::class);

        // Retrieve list of products from the database
        $products = $productRepository->findAll();

        // Transform the products array into a format suitable for JSON response
        $formattedProducts = [];
        foreach ($products as $product) {
            $formattedProducts[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'image' => $product->getImage(),
                'price' => $product->getPrice(),
            ];
        }

        // Return the products as JSON response
        return $this->json($formattedProducts);
    }

    /**
     * @Route("/api/products/{productId}", name="api_product_details", methods={"GET"})
     */
    public function getProductDetails($productId): JsonResponse
    {
        // Get the entity manager
        $entityManager = $this->getDoctrine()->getManager();

        // Get the product repository
        $productRepository = $entityManager->getRepository(Product::class);

        // Get the product corresponding to the provided ID
        $product = $productRepository->find($productId);

        // Check if the product exists
        if (!$product) {
            // Return a JSON response with an error message if the product is not found
            return $this->json(['error' => 'Product not found'], 404);
        }

        // Return the product details as a JSON response
        return $this->json($product);
    }

    /**
     * @Route("/api/products", name="api_add_product", methods={"POST"})
     */
    public function addProduct(Request $request): JsonResponse
    {
        // Validate request data
        $data = json_decode($request->getContent(), true);
        if (empty($data['name']) || empty($data['price']) || empty($data['image']) || empty($data['description'])) {
            return $this->json(['error' => 'Some date are missing'], 400);
        }

        // Create a new Product entity and set its properties
        $product = new Product();
        $product->setName($data['name']);
        $product->setDescription($data['description']);
        $product->setImage($data['image']);
        $product->setPrice($data['price']);

        // Save the new product to the database
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($product);
        $entityManager->flush();

        // Return a success JSON response
        return $this->json(['message' => 'Product added successfully']);
    }

    /**
     * @Route("/api/products/{productId}", name="api_modify_product", methods={"PUT"})
     */
    public function modifyProduct($productId, Request $request): JsonResponse
    {

        // Validate request data
        $data = json_decode($request->getContent(), true);
        if (empty($data['name']) || empty($data['price'])) {
            return $this->json(['error' => 'Name and price are required'], 400);
        }

        // Retrieve the existing product from the database
        $product = $this->getDoctrine()->getRepository(Product::class)->find($productId);
        if (!$product) {
            return $this->json(['error' => 'Product not found'], 404);
        }

        // Update product fields with new data
        $product->setName($data['name']);
        $product->setDescription($data['description'] ?? ''); // Check if description is set
        $product->setImage($data['image'] ?? ''); // Check if image is set
        $product->setPrice($data['price']);

        // Save the updated product to the database
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return $this->json(['message' => 'Product modified successfully']);
    }

    /**
     * @Route("/api/products/{productId}", name="api_delete_product", methods={"DELETE"})
     */
    public function deleteProduct($productId): JsonResponse
    {
        // Retrieve the product from the database
        $product = $this->getDoctrine()->getRepository(Product::class)->find($productId);
        if (!$product) {
            return $this->json(['error' => 'Product not found'], 404);
        }

        // Logic to delete the product with $productId from the database
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($product);
        $entityManager->flush();

        // Return a success JSON response
        return $this->json(['message' => 'Product deleted successfully']);
    }

    // -------------------------- CART PART -------------------------- //

    /**
     * @Route("/api/carts/{productId}", name="api_add_to_cart", methods={"POST"})
     */
    public function addToCart($productId, Request $request): JsonResponse
    {
        // Get the current user
        $user = $this->getUser();
        if (!$user instanceof Users) {
            return $this->json(['error' => 'Invalid user'], 400);
        }

        // Ensure the user has a cart, create one if not
        $cart = $user->getCart();
        if (!$cart) {
            $cart = new Cart();
            $user->setCart($cart);
        }

        // Retrieve the product entity
        $product = $this->getDoctrine()->getRepository(Product::class)->find($productId);
        if (!$product) {
            return $this->json(['error' => 'Product not found'], 404);
        }

        // Check if the product is already in the user's cart
        $existingCartItem = $cart->getCartItemByProduct($product);

        if ($existingCartItem) {
            // Increment the quantity of the existing cart item
            $existingCartItem->setQuantity($existingCartItem->getQuantity() + 1);
        } else {
            // Create a new cart item and associate it with the product
            $cartItem = new CartItem();
            $cartItem->setProduct($product);
            $cartItem->setQuantity(1); // Set initial quantity to 1

            // Add the cart item to the user's cart
            $cart->addItem($cartItem);
        }

        // Persist changes to the database
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->flush();

        return $this->json(['message' => 'Product added to cart successfully']);
    }

    /**
     * @Route("/api/carts/{productId}", name="api_remove_from_cart", methods={"DELETE"})
     */
    public function removeFromCart($productId): JsonResponse
{
    // Get the current user
    $user = $this->getUser();
    if (!$user instanceof Users) {
        return $this->json(['error' => 'Invalid user'], 400);
    }

    // Ensure the user has a cart
    $cart = $user->getCart();
    if (!$cart) {
        return $this->json(['error' => 'Cart not found for the user'], 404);
    }

    // Find the cart item for the product
    $cartItem = $cart->getCartItems()->filter(function ($item) use ($productId) {
        return $item->getProduct()->getId() == $productId;
    })->first();

    if (!$cartItem) {
        return $this->json(['error' => 'Product not found in cart'], 404);
    }

    // Decrease the quantity of the product in the cart
    $quantity = $cartItem->getQuantity();
    if ($quantity > 1) {
        $cartItem->setQuantity($quantity - 1);
    } else {
        // If the quantity is 1, remove the product from the cart
        $cart->removeItemByProduct($cartItem);
        $this->getDoctrine()->getManager()->remove($cartItem);
    }

    // Save the changes to the database
    $this->getDoctrine()->getManager()->flush();

    return $this->json(['success' => 'Product removed from cart']);
}

    /**
     * @Route("/api/carts", name="get_cart_state", methods={"GET"})
     */
    public function getCartState()
    {
        // Get the current user
        $user = $this->getUser();
        if (!$user instanceof Users) {
            return $this->json(['error' => 'Invalid user'], 400);
        }

        // Ensure the user has a cart
        $cart = $user->getCart();
        if (!$cart) {
            return $this->json(['error' => 'Cart not found for the user'], 404);
        }

        // Get the products in the user's cart
        $cartItems = $cart->getCartItems()->toArray();

        // Convert the products to an array of product details
        $products = array_map(function ($item) {
            $product = $item->getProduct();
            return [
                'id' => $item->getId(),
                'cart_id' =>  $item->getCart()->getId(),
                'product_id' => $product->getId(),
                'quantity' => $item->getQuantity(),
            ];
        }, $cartItems);

        return $this->json(['products' => $products]);
    }
}

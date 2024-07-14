<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="cart")
 */
class Cart
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $userId;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="CartItem", mappedBy="cart", cascade={"persist", "remove"})
     */
    private $cartItems;


    // Getters and setters

    public function getUser(): ?Users
    {
        return $this->user;
    }

    public function setUser(Users $user): self
    {
        $this->user = $user;
        $this->userId = $user->getId();
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function getCartItems()
    {
        return $this->cartItems;
    }

    /**
     * Add a cart item to the cart.
     * 
     * @param CartItem $cartItem The cart item to add
     */
    public function addItem(CartItem $cartItem): void
    {
        $this->cartItems[] = $cartItem;
        $cartItem->setCart($this);
    }

    /**
     * Get the cart item associated with the given product, if it exists.
     * 
     * @param Product $product The product to search for
     * @return CartItem|null The cart item associated with the product, or null if not found
     */
    public function getCartItemByProduct(Product $product): ?CartItem
    {
        foreach ($this->cartItems as $cartItem) {
            if ($cartItem->getProduct() === $product) {
                return $cartItem;
            }
        }
        return null;
    }

    /**
     * Check if the cart contains a specific product.
     * 
     * @param Product $product The product to check
     * @return bool True if the product is in the cart, false otherwise
     */
    public function containsProduct(Product $product): bool
    {
        foreach ($this->cartItems as $cartItem) {
            if ($cartItem->getProduct() === $product) {
                return true;
            }
        }
        return false;
    }

    /**
     * Remove the cart item associated with a specific product.
     * 
     * @param Product $product The product to remove
     */
    public function removeItemByProduct(Product $product): void
    {
        foreach ($this->cartItems as $key => $cartItem) {
            if ($cartItem->getProduct() === $product) {
                unset($this->cartItems[$key]);
                return;
            }
        }
    }
}
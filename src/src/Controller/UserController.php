<?php

namespace App\Controller;

use App\Entity\Users;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{

    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/api/users", name="api_modify_user", methods={"PUT"})
     */
    public function modifyUser(Request $request): JsonResponse
    {
        // Retrieve current user
        $currentUser = $this->getUser();

        // Extract user data from the request
        $data = json_decode($request->getContent(), true);

        // Check if the current user is an instance of Users
        if (!$currentUser instanceof Users) {
            return new JsonResponse(['error' => 'User information not available'], JsonResponse::HTTP_BAD_REQUEST);
        }
        // Update username if provided in the request
        if(isset($data['username']))  {
            $currentUser->setUsername($data['username']);
        }
        // Update password if provided in the request
        if(isset($data['password']))  {
            $currentUser->setPassword($data['password']);
        }
        // Update user information if provided in the request
        if (isset($data['email'])) {
            $currentUser->setEmail($data['email']);
        }
        if (isset($data['firstname'])) {
            $currentUser->setFirstname($data['firstname']);
        }
        if (isset($data['lastname'])) {
            $currentUser->setLastname($data['lastname']);
        }

        // Persist changes to the database
        $this->entityManager->flush();

        // Return success response
        return new JsonResponse(['message' => 'User information updated successfully'], JsonResponse::HTTP_OK);
    }

    /**
     * @Route("/api/users", name="api_display_user", methods={"GET"})
     */
    public function displayUser(): JsonResponse
    {
        // Retrieve current user
        $currentUser = $this->getUser();

        // Check if the current user is an instance of Users
        if ($currentUser instanceof Users) {
            // Return user information
            return new JsonResponse([
                'username' => $currentUser->getUsername(),
                'email' => $currentUser->getEmail(),
                'firstname' => $currentUser->getFirstname(),
                'lastname' => $currentUser->getLastname(),
            ]);
        } else {
            return new JsonResponse(['error' => 'User information not available'], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
}
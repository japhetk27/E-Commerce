<?php

namespace App\Controller;

use App\Entity\Users;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthController extends AbstractController
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    /**
     * @Route("/api/login", name="api_login", methods={"POST"})
     */
    public function login(Request $request): JsonResponse
    {
        // Extract login data from the request
        $data = json_decode($request->getContent(), true);

        // Validate the required fields (username and password)
        if (empty($data['username']) || empty($data['password'])) {
            return $this->json(['error' => 'Username and password are required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Retrieve the user from the database based on the username
        $userRepository = $this->getDoctrine()->getRepository(Users::class);
        $user = $userRepository->findOneBy(['username' => $data['username']]);

        // Check if user exists and verify the password
        if (!$user || $user->getPassword() !== $data['password']) {
            return $this->json(['error' => 'Invalid username or password'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Generate JWT token
        $token = $this->jwtManager->create($user);

        // Return the token in the response
        return $this->json(['token' => $token], JsonResponse::HTTP_OK);
    }
}
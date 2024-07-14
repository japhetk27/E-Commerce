<?php

namespace App\Controller;

use App\Entity\Users;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class RegistrationController extends AbstractController
{

   /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     */
    public function register(Request $request): Response
    {
        // Extract registration data from the request
        $data = json_decode($request->getContent(), true);

        // Validate the required fields (username, password, email, firstname, lastname)
        if (
            empty($data['username']) ||
            empty($data['password']) ||
            empty($data['email']) ||
            empty($data['firstname']) ||
            empty($data['lastname'])
        ) {
            return $this->json(['error' => 'All fields are required'], Response::HTTP_BAD_REQUEST);
        }

        // Check if the username or email already exists in the database
        $existingUser = $this->getDoctrine()->getRepository(Users::class)->findOneBy([
            'username' => $data['username'],
        ]);
        if ($existingUser) {
            return $this->json(['error' => 'Username already exists'], Response::HTTP_CONFLICT);
        }

        $existingEmail = $this->getDoctrine()->getRepository(Users::class)->findOneBy([
            'email' => $data['email'],
        ]);
        if ($existingEmail) {
            return $this->json(['error' => 'Email already exists'], Response::HTTP_CONFLICT);
        }

        // Create a new user entity
        $user = new Users();
        $user->setUsername($data['username']);
        $user->setPassword($data['password']);
        $user->setEmail($data['email']);
        $user->setFirstname($data['firstname']);
        $user->setLastname($data['lastname']);

        // Persist the new user entity to the database
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        // Return a success response
        return $this->json(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }
}

<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Aici ar trebui să conectezi la baza de date
// Eu fac exemplul fără DB pentru simplitate

// Preluare date POST
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');
$role = trim($data['role'] ?? 'user'); // implicit user normal

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Username și parola sunt obligatorii."]);
    exit;
}

// Aici ar trebui să salvezi userul în baza de date cu parola HASHUITĂ
// Exemplu simplu: salvare într-un fișier JSON doar ca demo

$file = __DIR__ . '/users.json';
$users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

foreach ($users as $user) {
    if ($user['username'] === $username) {
        http_response_code(400);
        echo json_encode(["error" => "User deja există."]);
        exit;
    }
}

// HASHUIRE parola
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$users[] = [
    'username' => $username,
    'password' => $hashedPassword,
    'role' => $role
];

file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));

echo json_encode(["success" => "Utilizator creat cu succes!"]);
?>

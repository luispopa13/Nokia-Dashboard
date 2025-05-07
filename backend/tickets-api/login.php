<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = 'secretulTauFoarteSecret';
$expiration = 3600;

// === Conectare la SQL Server ===
$serverName = "DESKTOP-6LMVUCH"; // <-- modifică dacă ai alt server
$connectionOptions = [
    "Database" => "TicketsDB",
    "TrustServerCertificate" => true,
    "Encrypt" => false
];

$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Conexiunea la baza de date a eșuat"]);
    exit();
}

// === Preluare date de la client ===
$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(["error" => "Username și parola sunt necesare."]);
    exit();
}

// === Căutăm utilizatorul ===
$sql = "SELECT * FROM Users WHERE username = ?";
$stmt = sqlsrv_query($conn, $sql, [$username]);

if ($stmt && ($user = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC))) {
    if (password_verify($password, $user['password'])) {
        // Utilizator valid, generăm token JWT
        $payload = [
            "iss" => "localhost",
            "aud" => "localhost",
            "iat" => time(),
            "exp" => time() + $expiration,
            "data" => [
                "username" => $user['username'],
                "role" => $user['role']
            ]
        ];

        $jwt = JWT::encode($payload, $secretKey, 'HS256');

        echo json_encode(["token" => $jwt, "role" => $user['role']]);
        exit();
    } else {
        // Parolă greșită
        http_response_code(401);
        echo json_encode(["error" => "Parolă incorectă."]);
        exit();
    }
} else {
    // User nu există
    http_response_code(401);
    echo json_encode(["error" => "Utilizatorul nu există."]);
    exit();
}

sqlsrv_close($conn);
?>

<?php
$serverName = "DESKTOP-6LMVUCH";

$connectionOptions = [
    "Database" => "TicketsDB",
    "TrustServerCertificate" => true
];

$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    die(json_encode([
        "error" => "❌ Conexiunea a eșuat",
        "details" => sqlsrv_errors()
    ]));
}
?>

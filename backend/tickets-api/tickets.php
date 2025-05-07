<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Conectare SQL
$connectionOptions = array(
    "Database" => "TicketsDB",
    "TrustServerCertificate" => true,
    "Encrypt" => false
);
$serverName = "DESKTOP-6LMVUCH";
$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    echo json_encode(["error" => "Conexiune eșuată"]);
    exit;
}

// Filtrăm ticketele doar dacă a fost dat status în URL
$status = $_GET['status'] ?? null;

$whereClause = '';
if ($status) {
    $whereClause = "WHERE status = ?";
}

$sql = "
SELECT 
    t.id, t.incident_title, t.status, t.project,
    FORMAT(t.start_date, 'yyyy-MM-dd HH:mm:ss') as start_date,
    p.priority AS priority_name
FROM Tickets t
JOIN Priority p ON t.priority_id = p.id
$whereClause
ORDER BY t.start_date DESC
";

$params = [];
if ($status) {
    $params[] = $status;
}

$stmt = sqlsrv_query($conn, $sql, $params);

$tickets = [];
if ($stmt) {
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $tickets[] = $row;
    }
}

echo json_encode($tickets);

sqlsrv_close($conn);
?>

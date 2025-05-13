<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Conectare SQL
$serverName = "DESKTOP-6LMVUCH";
$connectionOptions = [
    "Database" => "TicketsDB",
    "TrustServerCertificate" => true,
    "Encrypt" => false
];
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
    t.id, t.incident_title, t.status, t.project, t.description, t.comment, t.assigned_person, t.team_assigned_person, t.created_by, t.team_created_by, t.response_time, s.duration_hours,
    FORMAT(t.start_date, 'yyyy-MM-dd HH:mm:ss') as start_date,
    p.priority AS priority_name
FROM Tickets t
JOIN Priority p ON t.priority_id = p.id
JOIN SLA s ON s.id = t.priority_id
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

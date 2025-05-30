<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'sobf5627_gilang', '@Gilang123', 'sobf5627_realtimegilang');
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
$team = [];
$res = $conn->query("SELECT subid, COUNT(*) as conversions, SUM(payout) as earnings FROM conversions GROUP BY subid ORDER BY conversions DESC");
$rank = 1;
while($row = $res->fetch_assoc()) {
    $team[] = [
        "rank" => $rank++,
        "subid" => $row['subid'],
        "conversions" => intval($row['conversions']),
        "earnings" => floatval($row['earnings'])
    ];
}
echo json_encode($team);
?> 
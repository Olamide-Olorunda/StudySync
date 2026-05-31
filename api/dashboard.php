<?php

declare(strict_types=1);

require_once __DIR__ . '/_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed', 405);
}

$userId = require_auth();

$stmt = $pdo->prepare(
    'SELECT sg.id, sg.name, c.course_code
     FROM study_groups sg
     JOIN courses c ON sg.course_id = c.id
     JOIN group_members gm ON sg.id = gm.group_id
     WHERE gm.user_id = ?
     ORDER BY sg.name'
);
$stmt->execute([$userId]);
$groups = $stmt->fetchAll();

$payload = array_map(static function (array $group): array {
    return [
        'id' => (int) $group['id'],
        'name' => $group['name'],
        'course_code' => $group['course_code'],
    ];
}, $groups);

json_response(['groups' => $payload]);

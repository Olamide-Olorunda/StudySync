<?php

declare(strict_types=1);

require_once __DIR__ . '/../_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed', 405);
}

$userId = require_auth();

$stmt = $pdo->prepare(
    'SELECT sg.id, sg.name, sg.description, c.course_code, c.course_name,
            CASE WHEN gm.user_id IS NULL THEN 0 ELSE 1 END AS is_member
     FROM study_groups sg
     JOIN courses c ON sg.course_id = c.id
     LEFT JOIN group_members gm ON sg.id = gm.group_id AND gm.user_id = ?
     ORDER BY c.course_code, sg.name'
);
$stmt->execute([$userId]);
$groups = $stmt->fetchAll();

$payload = array_map(static function (array $group): array {
    return [
        'id' => (int) $group['id'],
        'name' => $group['name'],
        'description' => $group['description'],
        'course_code' => $group['course_code'],
        'course_name' => $group['course_name'],
        'is_member' => (bool) $group['is_member'],
    ];
}, $groups);

json_response(['groups' => $payload]);

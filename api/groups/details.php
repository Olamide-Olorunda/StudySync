<?php

declare(strict_types=1);

require_once __DIR__ . '/../_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed', 405);
}

$userId = require_auth();
$groupId = filter_input(INPUT_GET, 'group_id', FILTER_VALIDATE_INT);

if (!$groupId) {
    json_error('Group ID is required.', 422);
}

$stmt = $pdo->prepare(
    'SELECT sg.id, sg.name, sg.description, c.course_code, c.course_name
     FROM study_groups sg
     JOIN courses c ON sg.course_id = c.id
     WHERE sg.id = ?'
);
$stmt->execute([$groupId]);
$group = $stmt->fetch();

if (!$group) {
    json_error('Group not found.', 404);
}

$stmt = $pdo->prepare(
    'SELECT u.id, u.name
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     WHERE gm.group_id = ?
     ORDER BY u.name'
);
$stmt->execute([$groupId]);
$members = $stmt->fetchAll();

$stmt = $pdo->prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?');
$stmt->execute([$groupId, $userId]);
$isMember = (bool) $stmt->fetch();

json_response([
    'group' => [
        'id' => (int) $group['id'],
        'name' => $group['name'],
        'description' => $group['description'],
        'course_code' => $group['course_code'],
        'course_name' => $group['course_name'],
    ],
    'members' => array_map(static function (array $member): array {
        return [
            'id' => (int) $member['id'],
            'name' => $member['name'],
        ];
    }, $members),
    'is_member' => $isMember,
]);

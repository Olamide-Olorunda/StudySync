<?php

declare(strict_types=1);

require_once __DIR__ . '/../_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$userId = require_auth();
$input = get_json_input();
$groupId = (int) ($input['group_id'] ?? 0);

if ($groupId <= 0) {
    json_error('Group ID is required.', 422);
}

try {
    $stmt = $pdo->prepare('INSERT INTO group_members (user_id, group_id) VALUES (?, ?)');
    $stmt->execute([$userId, $groupId]);
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        json_error('You are already a member of this group.', 409);
    }

    json_error('Unable to join group.', 500);
}

json_response(['message' => 'Successfully joined the group!']);

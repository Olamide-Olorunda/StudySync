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

$stmt = $pdo->prepare('DELETE FROM group_members WHERE user_id = ? AND group_id = ?');
$stmt->execute([$userId, $groupId]);

json_response(['message' => "You've left the group."]);

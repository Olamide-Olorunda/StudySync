<?php

declare(strict_types=1);

require_once __DIR__ . '/../_helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed', 405);
}

if (!isset($_SESSION['user_id'])) {
    json_error('Unauthorized', 401);
}

$userId = (int) $_SESSION['user_id'];
$name = $_SESSION['user_name'] ?? null;
$email = $_SESSION['user_email'] ?? null;

if ($name === null || $email === null) {
    $stmt = $pdo->prepare('SELECT name, email FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    if ($user) {
        $name = $user['name'];
        $email = $user['email'];
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
    }
}

json_response([
    'user' => [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
    ],
]);

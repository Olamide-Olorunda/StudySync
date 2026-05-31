<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/db.php';

const API_ALLOWED_METHODS = 'GET, POST, OPTIONS';

const API_ALLOWED_HEADERS = 'Content-Type';

function apply_cors(): void
{
    $origin = getenv('FRONTEND_ORIGIN');
    if (!$origin) {
        return;
    }

    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: ' . API_ALLOWED_HEADERS);
    header('Access-Control-Allow-Methods: ' . API_ALLOWED_METHODS);
    header('Vary: Origin');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    json_response(['error' => $message], $status);
}

function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return [];
    }

    return $data;
}

function require_auth(): int
{
    if (!isset($_SESSION['user_id'])) {
        json_error('Unauthorized', 401);
    }

    return (int) $_SESSION['user_id'];
}

apply_cors();

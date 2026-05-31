<?php

declare(strict_types=1);

$distPath = __DIR__ . '/frontend/dist';
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

if ($requestPath !== '/') {
    $candidate = realpath($distPath . $requestPath);
    if ($candidate && str_starts_with($candidate, $distPath) && is_file($candidate)) {
        $mimeType = mime_content_type($candidate) ?: 'application/octet-stream';
        header('Content-Type: ' . $mimeType);
        readfile($candidate);
        exit;
    }
}

$indexFile = $distPath . '/index.html';
if (is_file($indexFile)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($indexFile);
    exit;
}

http_response_code(500);
echo 'Frontend build not found. Run "npm --prefix frontend run build".';

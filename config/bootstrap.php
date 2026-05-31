<?php

declare(strict_types=1);

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (!empty($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443);
$frontendOrigin = getenv('FRONTEND_ORIGIN') ?: '';
$sameSite = $frontendOrigin ? 'None' : 'Lax';

$cookieParams = session_get_cookie_params();

session_set_cookie_params([
    'lifetime' => 0,
    'path' => $cookieParams['path'] ?? '/',
    'domain' => $cookieParams['domain'] ?? '',
    'secure' => $https,
    'httponly' => true,
    'samesite' => $sameSite,
]);

ini_set('session.use_strict_mode', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_secure', $https ? '1' : '0');
ini_set('session.cookie_samesite', $sameSite);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

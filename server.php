<?php

/*
|--------------------------------------------------------------------------
| Laravel Router for PHP's Built-in Server
|--------------------------------------------------------------------------
|
| Emulates mod_rewrite so the PHP dev server can serve static files from
| the public/ directory and route all other requests to public/index.php.
|
*/

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    return false; // Serve the requested resource as-is.
}

require_once __DIR__ . '/public/index.php';

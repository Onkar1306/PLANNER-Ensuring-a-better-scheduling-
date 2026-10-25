<?php
/**
 * Handle account registration and login without ever persisting a plaintext
 * password. The database column `password_hash` must be VARCHAR(255) or larger.
 */

function respond(int $statusCode, string $message): void
{
    http_response_code($statusCode);
    echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'Method not allowed.');
}

$action = $_POST['action'] ?? '';
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($password)) {
    respond(400, 'Please provide a valid email address and password.');
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Move these credentials to environment-specific configuration before deployment.
    $conn = new mysqli('localhost', 'root', '1234', 'test', 3306);
    $conn->set_charset('utf8mb4');

    if ($action === 'register') {
        $username = trim($_POST['username'] ?? '');

        if ($username === '' || strlen($password) < 8) {
            respond(400, 'Name and a password of at least 8 characters are required.');
        }

        // PASSWORD_DEFAULT selects PHP's recommended slow, salted password hash.
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        if ($passwordHash === false) {
            respond(500, 'Unable to secure the password. Please try again.');
        }

        $stmt = $conn->prepare(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
        );
        $stmt->bind_param('sss', $username, $email, $passwordHash);
        $stmt->execute();
        $stmt->close();

        respond(201, 'Registration successful.');
    }

    if ($action === 'login') {
        $stmt = $conn->prepare(
            'SELECT password_hash FROM users WHERE email = ? LIMIT 1'
        );
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->bind_result($storedPasswordHash);
        $userFound = $stmt->fetch();
        $stmt->close();

        // Use one response for a missing account or an incorrect password.
        if (!$userFound || !password_verify($password, $storedPasswordHash)) {
            respond(401, 'Invalid email or password.');
        }

        // Refresh the stored value when PHP's recommended algorithm changes.
        if (password_needs_rehash($storedPasswordHash, PASSWORD_DEFAULT)) {
            $newPasswordHash = password_hash($password, PASSWORD_DEFAULT);
            if ($newPasswordHash === false) {
                respond(500, 'Unable to secure the password. Please try again.');
            }

            $update = $conn->prepare(
                'UPDATE users SET password_hash = ? WHERE email = ?'
            );
            $update->bind_param('ss', $newPasswordHash, $email);
            $update->execute();
            $update->close();
        }

        respond(200, 'Login successful.');
    }

    respond(400, 'Invalid account action.');
} catch (mysqli_sql_exception $exception) {
    // Do not expose database details, which could include sensitive information.
    respond(500, 'Unable to process your request. Please try again later.');
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}

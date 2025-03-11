<?php
// Retrieve the form data
$username = $_POST['username'];
$email = $_POST['email'];
$password_hash = $_POST['password_hash']; // Make sure you're hashing the password later for security

// Database connection
$conn = new mysqli('localhost', 'root', 1234 , 'test', 3306); // Replace 'your_password' with the actual password

// Check connection
if ($conn->connect_error) {
    die('Connection Failed: ' . $conn->connect_error);
} else {
    // Prepare and bind the SQL statement
    $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password_hash);

    // Execute the statement
    $stmt->execute();
    
    echo "Registration successful!";
    
    // Close the statement and connection
    $stmt->close();
    $conn->close();
}
?>

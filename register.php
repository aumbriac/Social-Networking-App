<?php

require('./common.php');

$username = $_POST['username'];
$password = $_POST['password'];
$confirmPassword = $_POST['confirmPassword'];
$email = $_POST['email'];

if (!isset($username) || $username === '' || $username === null
    || !isset($password) || $password === '' || $password === null
    || !isset($confirmPassword) || $confirmPassword === '' || $confirmPassword === null
    || !isset($email) || $email === '' || $email === null){
    exit('field_empty');
}

if ($password !== $confirmPassword){
    exit('password_mismatch');
}

$sql = "SELECT username 
        FROM users 
        WHERE username = '$username'";
$statement = $connect->prepare($sql);
$statement->execute();
$result = $statement->rowCount();

if ($result > 0){
    exit('account_exists');
} else {
    $password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, password, email) 
            VALUES ('$username', '$password', '$email')";
    $statement = $connect->prepare($sql);
    $statement->execute();
    exit('success');
}
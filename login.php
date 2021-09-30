<?php

require('./common.php');

$username = $_POST['username'];
$password = $_POST['password'];

if (!isset($username) || $username === '' || $username === null
    || !isset($password) || $password === '' || $password === null){
    exit('field_empty');
}

$sql = "SELECT * 
        FROM users 
        WHERE username = '$username'";
$statement = $connect->prepare($sql);
$statement->execute();
$db = $statement->fetch();
if (false === $db){
    exit('user_not_found');
} else {
    if (password_verify($password, $db['password'])){
        // User has been logged in
        $_SESSION['username'] = $db['username'];
        $_SESSION['id'] = $db['id'];
        $_SESSION['online'] = true;
        exit('success');
    } else {
        exit('invalid_password');
    }
}
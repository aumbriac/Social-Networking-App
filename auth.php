<?php

require('./common.php');

$username = $_SESSION['username'];

if (!isset($username) || $username === null){
    exit('unauthorized');
}

$sql = "SELECT username FROM users WHERE username = '$username'";
$statement = $connect->prepare($sql);
$statement->execute();
$result = $statement->rowCount();
if ($result > 0){
    exit('authorized');
} else {
    exit('error');
}
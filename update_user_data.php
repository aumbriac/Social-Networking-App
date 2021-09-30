<?php

require('common.php');

$user_id = $_SESSION['id'];
$bio = $_POST['bio'];

if (isset($_POST['bio'])){
    $sql = "UPDATE users SET bio = '$bio' WHERE id = $user_id";
    $statement = $connect->prepare($sql);
    $result = $statement->execute();
    exit($bio);
}

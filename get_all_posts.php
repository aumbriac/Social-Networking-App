<?php

require('common.php');

if (isset($_GET['get_all_posts'])){
    $sql = "SELECT DISTINCT posts.post_id, posts.text, posts.image, posts.user_id, posts.timestamp, users.username, users.profile_pic, users.bio
            FROM posts 
            INNER JOIN users 
            ON users.id = posts.user_id 
            ORDER BY posts.timestamp 
            ASC";
    $statement = $connect->prepare($sql);
    $statement->execute();
    $result = $statement->fetchAll();
    exit(json_encode($result));
}

<?php

require('common.php');

if (isset($_GET['get_all_loves'])){
    $sql = "SELECT * FROM loves 
            INNER JOIN posts 
            ON posts.post_id = loves.love_post_id";
    $statement = $connect->prepare($sql);
    $statement->execute();
    $result = $statement->fetchAll();
    exit(json_encode($result));
}

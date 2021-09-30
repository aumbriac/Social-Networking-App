<?php

require('./common.php');

$user_id = $_SESSION['id'];

$path = null;

$uploads_dir = '/img';

if (isset($_FILES['file']['name'])){
    $allowed = array('gif', 'png', 'jpg', 'jpeg');
    $filename = $_FILES['file']['name'];
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    if (!in_array($ext, $allowed)) {
        exit('File must be a .gif, .png, or .jpg image');
    }
    if ($_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $tmp_name = $_FILES["file"]["tmp_name"];
        // basename() may prevent filesystem traversal attacks;
        // further validation/sanitation of the filename may be appropriate
        $name = uniqid().".$ext";
        while (file_exists("./img/$name")){
            $name = uniqid().".$ext";
        }
        $path = "./img/$name";
        move_uploaded_file($tmp_name, $path);
    }
}


$post_text = htmlspecialchars(addslashes($_POST['post_text']));
$sql = "INSERT INTO posts (user_id, text, image) VALUES ($user_id, '$post_text', '$path')";
$statement = $connect->prepare($sql);
$statement->execute();
$sql = "SELECT users.username, users.profile_pic, users.bio, posts.timestamp, posts.text, posts.image, posts.post_id
        FROM users 
        INNER JOIN posts 
        ON users.id = posts.user_id 
        ORDER BY timestamp DESC";
$statement = $connect->prepare($sql);
$statement->execute();
$result = $statement->fetchAll();

exit(json_encode([  'path' => $path,
                    'id' => $user_id,
                    'data' => $result
                ]));
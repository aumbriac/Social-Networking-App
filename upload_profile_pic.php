<?php

require('./common.php');

$user_id = $_SESSION['id'];

$uploads_dir = '/img';

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
    $sql = "UPDATE users SET profile_pic = '$path' WHERE id = '$user_id'";
    $statement = $connect->prepare($sql);
    $result = $statement->execute();
    exit(json_encode(['path' => $path,
                        'id' => $user_id]));
}

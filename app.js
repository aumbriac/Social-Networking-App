
let user_id;

const getUserData = async () => {
    let data;
    await $.get('./get_user_data.php', (res) => {
        data = res;
    })
    return data;
}

$(async() => {
    const data = await getUserData();
    const json = JSON.parse(data);
    user_id = json.id;
})

const populatePosts = async (user_id, poster, profilePic, text, bio, postImage, timestamp, hash) => {
    await $('#posts')
        .prepend(`
        <div id="post_${hash}" class="card border border-light bg-dark rounded mb-3" style="max-width: 100%;">
        <div id="delete_post_${hash}" class="material-icons delete-post">close</div>
            <div class="card-header bg-dark bg-gradient">
                <img class="post_avatar_${user_id} rounded-circle bg-light float-start me-3 mt-2" src="${profilePic}" style="width: 50px;height: 50px; object-fit: cover" />
                <h3 class="mb-0">${poster}</h3>
                <p class="mb-0">${bio}</p>
            </div>
            <div class="card-body fw-lighter">
                <h3 id="card-title-${hash}" class="card-title">${text}</h3>
                ${postImage !== null && postImage !== '' ? `<div class="text-center my-3"><img class="img-thumbnail text-center" src="${postImage}" /></div>` : ''}
                    <div class="d-flex">
                        <div id="love_post_${hash}" class="material-icons love-post">favorite_outline</div>&nbsp;
                        <span id="love_post_count_${hash}">0</span>&nbsp;<span class="text-light"> total likes</span>
                    </div>
                    <p class="card-text ms-auto"><small class="text-muted">posted ${timestamp}</small></p>
                </div>
            </div>
        </div>
    `);
}

const getAllPosts = async () => {
    await $.get('./get_all_posts.php', { get_all_posts: true }, (res) => {
        let obj = JSON.parse(res);
        $.map(obj, (val, idx) => {
            populatePosts(val.user_id, val.username, val.profile_pic, val.text, val.bio, val.image, val.timestamp, val.post_id);
        })
    })
}

const getAllLoves = async () => {
    await $.get('./get_all_loves.php', { get_all_loves: true }, (res) => {
        let obj = JSON.parse(res);
        let count;

        $.map(obj, (val, idx) => {
            // Map through loves
            count = obj.filter((obj) => obj.love_post_id === val.love_post_id).length;

            // If user has loved the post, display it on the client side
            if (val.love_user_id == user_id){
                $("#love_post_" + val.love_post_id).text('favorite')
                $("#love_post_" + val.love_post_id).css('color', 'red')  
            }
            // Set the number of likes for each post
            $("#love_post_count_" + val.love_post_id).text(count);
        })
    })
}


$(async () => {
    const data = await getUserData();
    const json = JSON.parse(data);

    // Hide loader once data has been loaded
    $('#loader').hide();
    $('main').removeClass('d-none');

    // Set profile pic and user data
    $("#profile-pic").attr('src', json.profile_pic);
    $("#username").text(json.username);
    $('#dropdown-username').text(json.username);
    $('#bio').text(json.bio);

    // Get all posts
    $(`#posts`).hide();
    await getAllPosts();

    // Get all loves 
    await getAllLoves();
    $(`#posts`).show();

    // Love post
    $(document).on('click', '.love-post', async (e) => {
        let targetId = $(e.target).attr('id');
        let hash = targetId.replace("love_post_", "");
        await $.post('./love_post.php', { hash: hash }, (res) => {
            $('#love_post_count_' + hash).text(res);
            if ($(e.target).text() === 'favorite_outline'){
                $(e.target).text('favorite');
                $(e.target).css('color', 'red');
            } else {
                $(e.target).text('favorite_outline');
                $(e.target).css('color', '#fff');
            }
        })
    })

    // Delete post
    $(document).on('click', '.delete-post', (e) => {
        let targetId = $(e.target).attr('id');
        let targetItem = targetId.replace("delete_", "");
        let hash = targetId.replace("delete_post_", "");
        $.post('./delete_post.php', { hash: hash }, (res) => {
            $('#'+targetItem).remove();
        })
    })
    // Delete all posts
    $('#delete-posts-btn').click((e) => {
        e.preventDefault();
        $.get('./delete_all_posts.php', {delete_posts: true}, (res) => {
            $('#posts').empty();
        })
    })

    // Submit post on 'Enter' keyup
    $('#post-input-text').keyup((e) => {
        if (e.key === 'Enter'){
            $('#post-form').submit();
        }
    })

    // Create new post on post form submit
    $('#post-form').submit(async (e) => {
        e.preventDefault();
        $(`#post-btn-loader`).toggleClass('d-none');
        let postInputText = $('#post-input-text').val();
        $('#post-input-text').val('')
        var fileData = $('#post-image-input').prop('files')[0];
        var formData = new FormData();
        formData.append('file', fileData);
        formData.append('post_text', postInputText)

        $.ajax({
            type: 'POST',
            url: './create_user_post.php',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {

                let obj = JSON.parse(data);
                if (obj === 'error') {
                    alert('An error occured');
                    return;
                }
                console.log(obj.data[0])
                populatePosts(obj.data[0].id, obj.data[0].username, obj.data[0].profile_pic, obj.data[0].text, obj.data[0].bio, 
                    obj.data[0].image, obj.data[0].timestamp, obj.data[0].post_id);
                $('#post-image-img').prop('src', '');
                if ($('#post-image-img').is(':visible')){
                    $('#post-image-img').toggleClass('d-none');
                }
                $('#upload-post-image-btn').text('image');
            },
            error: function (data) {
                console.log(data);
            },
        });

        $(`#post-btn-loader`).toggleClass('d-none');
    })
    $('#upload-post-image-btn').click(e => {
        if ($('#upload-post-image-btn').text() === 'close') {
            e.preventDefault();
            $('#post-image-input').val('');
            $('#post-image-img').toggleClass('d-none');
            $('#post-image-img').attr('src', '');
            $('#upload-post-image-btn').text('image');
            return;
        }

        $('#post-image-input').click();
    })
    $('#post-image-input').click(e => {
        if ($('#upload-post-image-btn').text() === 'close') {
            e.preventDefault();
            $('#post-image-img').toggleClass('d-none');
            $('#post-image-img').attr('src', '');
            $('#upload-post-image-btn').text('image');
            return;
        }
    });
    $('#post-image-input').change(e => {

        if ($('#post-image-input').val() === '') {
            e.preventDefault();
            $('#post-image-img').toggleClass('d-none');
            $('#post-image-img').attr('src', '');
            return;
        }


        $('#post-image-img').toggleClass('d-none');
        let tempPath = URL.createObjectURL(e.target.files[0]);
        $('#post-image-img').attr('src', tempPath);
        $('#upload-post-image-btn').text('close');
    })

    $(`#refresh-btn`).click(async () => {
        window.location = '#refresh-btn';
        $(`#posts`).html('<div id="posts-loader" class="text-center my-3"><div class="spinner-border" style="width: 7rem; height: 7rem; border-width: .5rem"></div></div>');
        await getAllPosts();
        await getAllLoves();
        $(`#posts-loader`).remove();
        $(`#posts`).show();
        // Update screen position if there are posts
        window.location = '#refresh-btn';

    })

    $('#update-bio-btn').click(e => {
        let bio = $('#bio').text();
        $('#bio-input').val(bio);
    })

    // Update bio
    $('#update-bio-form').submit((e) => {
        e.preventDefault();
        let bioInput = $('#bio-input').val();
        $.post('./update_user_data.php', {bio: bioInput}, (res) => {
            // Update bio from DB
            $('#bio').text(res);
            $('#bio-input').val('');
        })
    })

    $('#register-form').submit(e => {
        e.preventDefault();
        let username = $('#register-username').val(),
            password = $('#register-password').val(),
            confirmPassword = $('#register-confirm-password').val(),
            email = $('#register-email').val();
        if (confirmPassword !== password){
            alert('Passwords must match!');
            return;
        }
        $.post('./register.php', {username: username, password: password, confirmPassword: confirmPassword, email: email}, (res) => {
            alert('You have successfully registered!');
        })
    })

    $('#logout').click(e => {
        $.post('./logout.php', (res) => {
            if (res === 'success'){
                window.location = './index.html';
            }
        })
    })

    $('#login-form').submit(e => {
        e.preventDefault();
        let username = $('#login-username').val(),
            password = $('#login-password').val();
        $.post('./login.php', { username: username, password: password }, (res) => {
            if (res === 'success'){
                window.location = './posts.html';
            }
        })
    })

    // Update profile pic
    $('#update-profile-pic-btn').click(() => {
        $('#file').click();
    })
    $('#file').on('change', () => {
        $('#update-profile-pic-form').submit();
    })
    $('#update-profile-pic-form').submit(e => {
        e.preventDefault();
        var fileData = $('#file').prop('files')[0];
        var formData = new FormData();
        formData.append('file', fileData);

        $.ajax({
            type: 'POST',
            url: './upload_profile_pic.php',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $(`#update-profile-pic-btn-loader`).removeClass('d-none');
                let obj = JSON.parse(data);
                if (obj === 'error'){
                    alert('An error occured');
                    return;
                }
                $(`#profile-pic`).attr('src', obj.path);
                $(`.post_avatar_${obj.id}`).attr('src', obj.path);
            },
            error: function (data) {
                console.log(data);
            },
            complete: () => {
                $(`#update-profile-pic-btn-loader`).addClass('d-none');
            }
        });
    });
})


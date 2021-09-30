const authorizeUser = async () => {
    await $.post('./auth.php', (res) => {
        if (res === 'unauthorized') {
            window.location = 'index.html';
        } else {
            console.log("Authorized");
        }
    })
}

$(async () => {
    await authorizeUser();
    setInterval(authorizeUser, 1000)
})

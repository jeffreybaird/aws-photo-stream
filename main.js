$(document).ready(function() {
    loadPhotos();
});

function loadPhotos() {
    const pageToken = $('#pageToken').val();

    $.post(process.env.API_GATEWAY_URL, { pageToken: pageToken }, function(data) {
        const response = JSON.parse(data);
        const items = response.items;
        const nextPageToken = response.nextPageToken;

        items.forEach(function(photo) {
            const photoUrl = photo.url;
            const fileType = getFileType(photo);

            if (fileType === 'mov') {
                const videoElement = document.createElement('video');
                videoElement.src = photoUrl;
                videoElement.controls = true;
                videoElement.className = 'photo';

                const containerElement = document.createElement('div');
                containerElement.appendChild(videoElement);

                $('#photos').append(containerElement);
            } else {
                const imageElement = document.createElement('img');
                imageElement.src = photoUrl;
                imageElement.alt = 'photo';
                imageElement.className = 'photo';

                $('#photos').append(imageElement);
            }
        });

        if (nextPageToken) {
            $('#pageToken').val(nextPageToken || '');
            $('#loadMoreBtn').show();
        } else {
            $('#pageToken').val('');
            $('#loadMoreBtn').hide();
        }
    });
}

function getFileType(photo) {
    // Retrieve the file type based on your logic
    // For example, you can check the metadata or extract it from the URL
    // Adjust this code based on your specific implementation
    const url = new URL(photo.url);
    const extension = url.pathname.split('.').pop().toLowerCase();

    if (extension === 'mov') {
        return 'mov';
    } else {
        return 'image'; // Default to 'image' for other file types
    }
}

function loadMorePhotos() {
    $('#loadMoreBtn').hide();
    loadPhotos();
}

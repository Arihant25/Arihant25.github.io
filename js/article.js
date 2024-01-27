// Function to submit comment
const submitComment = () => {
    // Get the input values
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    // Create new comment
    const newComment = document.createElement('div');
    newComment.textContent = `${name}: ${comment}`;

    // Append new comment to comment section
    const commentSection = document.getElementById('comment-section');

    // Add the card class to the new comment
    newComment.classList.add('card');
    commentSection.append(newComment);

    // Clear the input fields
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';

    // Save comments to local storage
    const articleId = document.querySelector('article').id;
    localStorage.setItem('comments-' + articleId, commentSection.innerHTML);
}

window.onload = () => {
    // Load comments from local storage
    const articleId = document.querySelector('article').id;
    const savedComments = localStorage.getItem('comments-' + articleId);
    if (savedComments) {
        document.getElementById('comment-section').innerHTML = savedComments;
    }

    // Load likes from local storage
    const savedLikes = localStorage.getItem('likes-' + articleId) ?? 0;
    document.getElementById('like-count').textContent = savedLikes;
    const liked = localStorage.getItem('liked-' + articleId) === 'true';
    document.getElementById('like-button').textContent = liked ? 'Liked!' : 'Like';
    document.getElementById('like-button').disabled = liked;
}

// Function to like article
const likeArticle = () => {
    // Get the current like count
    const likeCount = document.getElementById('like-count');
    const likeButton = document.getElementById('like-button');
    const currentCount = parseInt(likeCount.textContent);

    // Increment the like count
    likeCount.textContent = currentCount + 1;

    // Change the text of the button
    likeButton.textContent = 'Liked!';
    likeButton.disabled = true; // Disable the button

    // Save likes to local storage
    const articleId = document.querySelector('article').id;
    localStorage.setItem('likes-' + articleId, currentCount + 1);
    localStorage.setItem('liked-' + articleId, true);
}
const btnGet = document.getElementById('btnGet')
const btnPost = document.getElementById('btnPost')

btnGet.addEventListener('click', () => {
  fetch('http://localhost:8080/feed/posts')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))
})

btnPost.addEventListener('click', () => {
  fetch('http://localhost:8080/feed/post', {
    method: 'POST',
    body: JSON.stringify({
      title: 'First Post',
      content: 'This is the first post!'
     }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))
})
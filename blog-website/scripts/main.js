const menuBtnEl = document.getElementById('menuBtn');
const navLinksEl = document.getElementById('nav-links');
const menuIconEl = document.getElementById('icon');
const readMore = document.querySelectorAll('.read-more')

// for menu button
const toggleMenu = () => {
    navLinksEl.classList.toggle('active');
    if (navLinksEl.classList.contains('active')) {
        menuIconEl.textContent = 'close';
    } else {
        menuIconEl.textContent = 'menu';
    }
}

menuBtnEl.addEventListener('click', toggleMenu);

const toggleReadMore = (event) => {
        event.preventDefault()
        const link = event.target
        const post = link.closest('.post')
        const moreText = post.querySelector('.more-text')

        const isExpanded = moreText.style.display === 'inline'

        if(isExpanded){
            moreText.style.display = 'none'
            link.textContent = 'Read more...'
        }else{
            moreText.style.display = 'inline'
            link.textContent = 'Read less...'
        }
    
}

// adding readmore functionality
readMore.forEach(link => {
    link.addEventListener('click', toggleReadMore)
})
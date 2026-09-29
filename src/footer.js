let html = `
<img alt="Logo" src="./assets/logo/brand.svg" height="32px" />
      <div class info_main>
        <div class="info_sub">
          <small><span>Make things possible.</span></small>
        </div>
        <div class="info_sub">
          <small>
            &copy; <span>VJDY Official Pictures, All Rights Reserved.</span>
          </small>
        </div>
        <div class="info_sub">
          <a href="https://github.com/vjdyofficial" target="_blank" rel="noopener noreferrer">
            <img src="./assets/icons/github.svg" class="tint" alt="Instagram">
          </a>
          <a href="https://instagram.com/vjdyofficial" target="_blank" rel="noopener noreferrer">
            <img src="./assets/icons/mdi-instagram.svg" class="tint" alt="Instagram">
          </a>
          <a href="https://threads.com/vjdyofficial" target="_blank" rel="noopener noreferrer">
            <img src="./assets/icons/mdi-threads.svg" class="tint" alt="Instagram">
          </a>
          <a href="https://x.com/vjdyofficial" target="_blank" rel="noopener noreferrer">
            <img src="./assets/icons/mdi-x.svg" class="tint" alt="Instagram">
          </a>
          <a href="https://tiktok.com/@vjdyofficial" target="_blank" rel="noopener noreferrer">
            <img src="./assets/icons/tiktok.svg" class="tint" alt="Instagram">
          </a>
          <a href="https://youtube.com/vjdyofficial" target="_blank" rel="noopener noreferrer">
            <img src="./assets/icons/mdi-youtube.svg" class="tint" alt="Instagram">
          </a>
        </div>
      </div>
`;

const footer = document.querySelector('footer')

if (footer) {
    footer.innerHTML = html;
} else {
    console.error('Cannot find footer. Please add footer element and ensure that only one footer can use for each page.')
}
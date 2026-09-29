const footer = document.querySelector('footer')

if (footer) {
    fetch('../src/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load footer.html: ${response.status}`);
            }

            return response.text();
        })
        .then(html => {
            footer.innerHTML = html;
        })
        .catch(error => {
            console.error('Cannot load footer HTML.', error);
        });
} else {
    console.error('Cannot find footer. Please add footer element and ensure that only one footer can use for each page.')
}
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const topicInput = document.getElementById('topic');
    const summaryDiv = document.getElementById('summary');
    const ImageDiv = document.getElementById('img1');
    const downloadButton = document.getElementById('downloadButton');
    const persianlan = document.getElementById('persian');
    const englishlan = document.getElementById('english');

    searchButton.addEventListener('click', function () {
      const topic = topicInput.value.trim();
      if (topic === '') {
        alert('Please enter a topic.');
        return;
      }
      
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`)
       .then(response => response.json())
       .then(data => {
          if (data.title && data.extract) {
            summaryDiv.innerHTML = `
              <h2 class="text-xl font-semibold mb-4">${data.title}</h2>
              <p>${data.extract}</p>
            `
            ;
        
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`)
            .then(res => res.json())
            .then((out) => {
                if (out.originalimage.source) {
                    ImageDiv.innerHTML = `
                    <img src="${out.originalimage.source}"/>`
                }
        }).catch(err => console.error(err));  
            downloadButton.classList.remove('hidden');
            downloadButton.addEventListener('click', function () {
              const blob = new Blob([data.extract], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${data.title}.txt`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            });
          } else {
            summaryDiv.innerHTML = '<p>No summary found for the given topic.</p>';
            downloadButton.classList.add('hidden');
          }
        })
       .catch(error => {
          console.error('Error fetching Wikipedia data:', error);
          summaryDiv.innerHTML = '<p>Failed to fetch data. Please try again later.</p>';
          downloadButton.classList.add('hidden');
        });
    });
    clearButton.addEventListener('click', function () {
      topicInput.value = '';
      summaryDiv.innerHTML = '';
      ImageDiv.innerHTML = '';
      downloadButton.classList.add('hidden');
    });
    persianlan.addEventListener('click', function () {
      
      fetch(`https://api.mymemory.translated.net/get?q=${summaryDiv.textContent}&langpair=en-GB|fa-IR`)
        .then(res => res.json())
        .then((output) => {
          if (output.responseData.translatedText) {
            summaryDiv.innerHTML = output.responseData.translatedText;
            
          }
        });
        englishlan.addEventListener('click', function () {
          // This will contain the English summary
      
          // Fetch English to English translation
          fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topicInput.value.trim()}`)
            .then(res => res.json())
            .then(output => {
              if (output.title && output.extract) {
                summaryDiv.innerHTML =               `<h2 class="text-xl font-semibold mb-4">${output.title}</h2>
                <p>${output.extract}</p>
              `
              } else {
                summaryDiv.innerHTML = '<p>No English translation available.</p>';
              }
            });
        });
      })
    });

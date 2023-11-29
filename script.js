document.addEventListener('DOMContentLoaded', () => {
    const theaterSelect = document.getElementById('theaterSelect');
    const searchBtn = document.getElementById('searchBtn');
    const movieDetails = document.getElementById('movieDetails');
  
    // Lataa teatterit valikkoon
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const theaters = xmlDoc.querySelectorAll('TheatreArea');
  
        theaters.forEach(theater => {
          const id = theater.querySelector('ID').textContent;
          const name = theater.querySelector('Name').textContent;
          const option = document.createElement('option');
          option.value = id;
          option.textContent = name;
          theaterSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Virhe teattereita ladatessa:', error);
      });
  
    // Kuuntele hakupainiketta
    searchBtn.addEventListener('click', () => {
      const selectedTheaterId = theaterSelect.value;
      if (selectedTheaterId !== '') {
        fetchMovies(selectedTheaterId);
      } else {
        alert('Valitse teatteri.');
      }
    });
  
    // Hae valitun teatterin elokuvatiedot
    function fetchMovies(theaterId) {
      const apiUrl = `https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`;
  
      fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const movies = xmlDoc.querySelectorAll('Show');
  
          let output = '<h2>Nykyiset elokuvat</h2>';
          movies.forEach(movie => {
            const title = movie.querySelector('Title').textContent;
            const startTime = movie.querySelector('dttmShowStart').textContent;
            const endTime = movie.querySelector('dttmShowEnd').textContent;
  
            output += `
              <div class="movie">
                <h3>${title}</h3>
                <p><strong>Alkuaika:</strong> ${startTime}</p>
                <p><strong>Loppuaika:</strong> ${endTime}</p>
              </div>
            `;
          });
  
          // Näytä elokuvatiedot movieDetails-divissä
          movieDetails.innerHTML = output;
        })
        .catch(error => {
          console.error('Virhe elokuvatietoja haettaessa:', error);
          movieDetails.innerHTML = '<p>Virhe elokuvatietoja haettaessa.</p>';
        });
    }
  });
  
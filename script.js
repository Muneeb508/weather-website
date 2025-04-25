// ----- script.js -----
const accessKey = '861e2b3152ef4788eed0d16638994782';  // ← replace with your Weatherstack key

const checkBtn  = document.getElementById('checkBtn');
const cityInput = document.getElementById('cityInput');
const resultDiv = document.getElementById('weatherResult');
const loader    = document.getElementById('loader');

checkBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    resultDiv.innerHTML = '<p style="color:red;">Please enter a city name.</p>';
    return;
  }

  // clear prior result & show spinner
  resultDiv.innerHTML = '';
  loader.style.display = 'block';

  // Weatherstack current weather endpoint
  const url = `http://api.weatherstack.com/current`
            + `?access_key=${accessKey}`
            + `&query=${encodeURIComponent(city)}`
            + `&units=m`;       // metric (°C)

  fetch(url)
    .then(res => res.json())
    .then(data => {
      loader.style.display = 'none';

      // handle errors
      if (data.error) {
        throw new Error(data.error.info || 'Unable to fetch weather');
      }

      displayWeather(data);
    })
    .catch(err => {
      loader.style.display = 'none';
      resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
});

function displayWeather(data) {
  // Weatherstack puts everything under `current` and location info under `location`
  const loc = data.location;
  const cur = data.current;
  // Weatherstack icons are full URLs
  const iconUrl = cur.weather_icons[0];

  resultDiv.innerHTML = `
    <h2>${loc.name}, ${loc.country}</h2>
    <img src="${iconUrl}" alt="${cur.weather_descriptions[0]}" />
    <p><strong>${cur.temperature}°C</strong> – ${cur.weather_descriptions[0]}</p>
    <p>Feels like ${cur.feelslike}°C</p>
    <p>Humidity: ${cur.humidity}%</p>
  `;
}

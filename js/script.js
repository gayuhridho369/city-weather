const locationDevice = document.getElementById('locationDevice');
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const iconSpinner = document.getElementById('iconSpinner');
const alertNotif = document.getElementById('alertNotif');
const alertMessage = document.getElementById('alertMessage');

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (/\S/.test(cityInput.value)) getWeather(cityInput.value);
});

locationDevice.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support Geolocation API");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    getWeather(null, latitude, longitude);
}

function onError(error) {
    alertNotif.style.opacity = 1;
    alertMessage.textContent = error.message;
}

async function weatherAPI(city, latitude, longitude) {
    let apiKey = '9424efc6364b1ec975663f31f2a6a026';
    let url;

    if (city === null) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    }

    try {
        return await fetch(url).then(response => response.json());
    } catch (error) {
        throw new Error(`Something is wrong: ${error.message}`);
    }
}

function getWeather(city = '', latitude = '', longitude = '') {
    alertNotif.style.opacity = 0;
    searchButton.classList.add('loading');
    iconSpinner.style.display = 'block';

    weatherAPI(city, latitude, longitude)
        .then((result) => {
            if (result.cod == '404') {
                alertNotif.style.opacity = 1;
                alertMessage.textContent = result.message;
            } else {
                updateDisplay(result);
            }
        })
        .catch((error) => {
            alertNotif.style.opacity = 1;
            alertMessage.textContent = error.message;
        })
        .finally(() => {
            searchButton.classList.remove('loading');
            iconSpinner.style.display = 'none';
        });
}

function updateDisplay(result) {
    const imgWeather = document.getElementById('imgWeather');
    const weatherId = result.weather[0].id;
    const temp = result.main.temp;
    const weatherDescription = result.weather[0].description;
    const city = `${result.name} (${result.sys.country})`;
    const lat = result.coord.lat;
    const lon = result.coord.lon;
    const visibility = result.visibility / 1000;
    const feelsLike = result.main.feels_like;
    const humidity = result.main.humidity;

    if (weatherId == 800) {
        imgWeather.src = "img/clear.svg";
    } else if (weatherId >= 200 && weatherId <= 232) {
        imgWeather.src = "img/storm.svg";
    } else if (weatherId >= 600 && weatherId <= 622) {
        imgWeather.src = "img/snow.svg";
    } else if (weatherId >= 701 && weatherId <= 781) {
        imgWeather.src = "img/haze.svg";
    } else if (weatherId >= 801 && weatherId <= 804) {
        imgWeather.src = "img/cloud.svg";
    } else if ((weatherId >= 500 && weatherId <= 531) || (weatherId >= 300 && weatherId <= 321)) {
        imgWeather.src = "img/rain.svg";
    }

    cityInput.value = result.name;
    document.getElementById('temp').textContent = temp;
    document.getElementById('weatherDescription').textContent = weatherDescription;
    document.getElementById('city').textContent = city;
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = lon;
    document.getElementById('visibility').textContent = visibility;
    document.getElementById('feelsLike').textContent = feelsLike;
    document.getElementById('humidity').textContent = humidity;
}
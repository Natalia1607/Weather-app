const link = "http://api.weatherstack.com/current?access_key=3f28eddde2a4b6965b1f9ab43af34942"; //8889d57647145852e079cecbff2427a1

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const formSubmit = document.getElementById('form');

let store = {
    city: "St. Petersburg",
    temperature: 0,   
    observationTime: "00:00 AM", 
    isDay: "yes",
    description: "",
    properties: {
        cloudcover: {},
        humidity: {}, 
        windSpeed: {},
        pressure: {},
        uvIndex: {},
        visibility: {},    
    },
};

const fetchData = async () => {
    try {
        const query = localStorage.getItem('query') || store.city;
        const result = await fetch(`${link}&query=${query}`);
        const data = await result.json();

        const {
            current: { 
                cloudcover, 
                temperature, 
                humidity,
                observation_time: observationTime, 
                pressure, 
                uv_index: uvIndex, 
                visibility,
                is_day: isDay,
                weather_descriptions: description,
                wind_speed: windSpeed,
            }, 
            location: {
                name,
            },
        } = data;

        store = {
            ...store,
            isDay,
            city: name,
            temperature,
            observationTime, 
            description: description[0],
            properties: {
                cloudcover: {
                    title: 'cloudcover',
                    value: `${cloudcover} %`,
                    icon: 'cloud.png'
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity} %`,
                    icon: 'humidity.png'
                }, 
                windSpeed: {
                    title: 'Wind speed',
                    value: `${windSpeed} km/h`,
                    icon: 'wind_speed.png'
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure} kPa`,
                    icon: 'pressure.png'
                },
                uvIndex: {
                    title: 'UV-index',
                    value: `${uvIndex}`,
                    icon: 'uvIndex.png'
                },
                visibility: {
                    title: 'visibility',
                    value: `${visibility} km`, 
                    icon: 'visibility.png'
                },   
            },
        };

        renderComponent();
    } catch(err) {
        console.log(err);
    }   
};

const getImage = (description) => {
    const value = description.toLowerCase();

    switch (value) {
        case "sunny":
            return "sunny.svg";
        case "overcast":
            return "overcast.svg"; 
        case "rain":
            return "rain.svg";
        case "fog":
            return "fog.svg";
        case "cloud":
            return "cloud.svg";
        case "snow":
            return "snow.svg";
        case "thunder":
            return "thunder.svg";
        case "partly cloudy":
            return "partly_cloudy.svg";
    }
};

const renderProperty = (properties) => {
    return Object.values(properties).map((data) => {
        const { title, value, icon } = data;
        return `<div class="property">
                    <div class="property-icon">
                        <img src="./../img/icons/${icon}" alt="">
                    </div>  
                    <div class="property-info">
                        <div class="property-info_value">${value}</div>
                        <div class="property-info_description">${title}</div>
                    </div>      
                </div>`;
     }).join("");
};

const markup = () => {
    const { city, description, observationTime, temperature, isDay, properties } = store;

    const containerClass = isDay === 'no' ? 'is-night' : '';

    return `<div class="container ${containerClass}">
                <div class="top">
                    <div class="city">
                        <div class="city-subtitle">Weather Today</div>
                        <div class="city-title" id="city">
                        <span>${city}</span>
                        </div>
                    </div>
                    <div class="city-info">
                        <div class="top-left">
                        <img class="icon" src="./../img/SVG/${getImage(description)}" alt="" />
                        <div class="description">${description}</div>
                        </div>

                        <div class="top-right">
                        <div class="city-info_subtitle">as of ${observationTime}</div>
                        <div class="city-info_title">${temperature}°C</div>
                        </div>
                    </div>
                </div>
            <div id="properties">${renderProperty(properties)}</div>
            </div>`;
};

const togglePopupClass = () => {
    popup.classList.toggle("active");
};

const renderComponent = () => {
    root.innerHTML = markup();

    const city = document.getElementById('city');
    city.addEventListener('click', togglePopupClass);
};

const handleInput = (event) => {
    store = {
        ...store,
        city: event.target.value,
    };
};

const handleSubmit = (event) => {
    event.preventDefault();
    const value = store.city;

    if(!value) return null;

    localStorage.setItem('query', value);
    fetchData();
    togglePopupClass();
};

formSubmit.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);

fetchData();
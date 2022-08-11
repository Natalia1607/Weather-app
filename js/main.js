const link = "http://api.weatherstack.com/current?access_key=e52aba545185df2a8b1695a571720874";

const root = document.getElementById('root');
let store = {
    city: "London",
    feelslike: 0,
    cloudcover: 0,
    temperature: 0,
    humidity: 0,
    observationTime: "00:00 AM",
    pressure: 0,
    uvIndex: 0,
    visibility: 0,
    isDay: "yes",
    description: "",
    windSpeed: 0,
};

const fetchData = async () => {
    const result = await fetch(`${link}&query=${store.city}`);
    const data = await result.json();

    const {
        current: { 
            feelslike, 
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
    } = data;

    store = {
        ...store,
        feelslike,
        cloudcover,
        temperature,
        humidity,
        observationTime,
        pressure,
        uvIndex,
        visibility,
        isDay,
        windSpeed,
        description: description[0],
    };

    renderComponent();
};

const markup = () => {
    const { city, description, observationTime, temperature} = store;

    return `<div class="container">
                <div class="top">
                    <div class="city">
                        <div class="city-subtitle">Weather Today</div>
                        <div class="city-title" id="city">
                        <span>${city}</span>
                        </div>
                    </div>
                    <div class="city-info">
                        <div class="top-left">
                        <img class="icon scr="./img/" alt="" />
                        <div class="description">${description}</div>
                        </div>

                        <div class="top-right">
                        <div class="city-info_subtitle">as of ${observationTime}</div>
                        <div class="city-info_title">${temperature}°C</div>
                        </div>
                    </div>
                </div>
            <div id="properties"></div>
            </div>`;
};

const renderComponent = () => {
    root.innerHTML = markup();
};

fetchData();
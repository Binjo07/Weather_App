// WEATHER MAPPER - Transform API data to app format


export function mapWeatherData(data, cityName, country) {
    const current = data.current_weather
    const daily = data.daily || {}

    return {
        name: cityName,
        country: country || '--',
        temperature: current.temperature,
        windSpeed: current.windspeed,
        weathercode: current.weathercode,
        description: getWeatherDescription(current.weathercode),
        icon: getWeatherIcon(current.weathercode),
        sunrise: formatTime(daily.sunrise?.[0]),
        sunset: formatTime(daily.sunset?.[0])
    }
}

export function mapForecastResponse(data) {
    const daily = data.daily || {}
    return daily.time?.map((date, index) => ({
        date: date,
        maxTemp: daily.temperature_2m_max?.[index] || 0,
        minTemp: daily.temperature_2m_min?.[index] || 0,
        weathercode: daily.weathercode?.[index] || 0,
        description: getWeatherDescription(daily.weathercode?.[index] || 0),
        icon: getWeatherIcon(daily.weathercode?.[index] || 0)
    })) || []
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy',
        3: 'Overcast', 45: 'Fog', 48: 'Fog',
        51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
        61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
        80: 'Rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
        95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Heavy thunderstorm'
    }
    return descriptions[code] || 'Unknown'
}

function getWeatherIcon(code) {
    const icons = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌦️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        71: '❄️', 73: '❄️', 75: '❄️',
        80: '🌧️', 81: '🌧️', 82: '🌧️',
        95: '⛈️', 96: '⛈️', 99: '⛈️'
    }
    return icons[code] || '🌡️'
}

function formatTime(timeString) {
    if (!timeString) return '--'
    try {
        const date = new Date(timeString)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    } catch {
        return '--'
    }
}
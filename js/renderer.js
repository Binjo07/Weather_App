// RENDERER - Updates the DOM


import { weatherDisplay, searchInput, historyList, forecastContainer, suggestionsContainer } from './dom.js'
import { getWeather, getUnit, isLoading, getCity } from './state.js'
import { isCached, getCacheAge } from './cache.js'

export function renderWeather() {
    if (isLoading()) {
        weatherDisplay.innerHTML = '<p>⏳ Loading...</p>'
        return
    }

    const weather = getWeather()
    if (!weather) {
        weatherDisplay.innerHTML = '<p>No weather data available. Search for a city.</p>'
        return
    }

    const unit = getUnit()
    const tempValue = unit === 'F'
        ? (weather.temperature * 9/5 + 32).toFixed(1)
        : weather.temperature

    weatherDisplay.innerHTML = ''

    const cityEl = document.createElement('p')
    cityEl.className = 'city'
    cityEl.textContent = `📍 ${weather.name}, ${weather.country}`

    const tempEl = document.createElement('p')
    tempEl.className = 'temp'
    tempEl.textContent = `${tempValue}°${unit}`

    const descEl = document.createElement('p')
    descEl.className = 'desc'
    descEl.textContent = `${weather.icon} ${weather.description}`

    const windEl = document.createElement('p')
    windEl.textContent = `💨 Wind: ${weather.windSpeed} km/h`

    const sunriseEl = document.createElement('p')
    sunriseEl.textContent = `🌅 Sunrise: ${weather.sunrise}`

    const sunsetEl = document.createElement('p')
    sunsetEl.textContent = `🌇 Sunset: ${weather.sunset}`

    weatherDisplay.append(cityEl, tempEl, descEl, windEl, sunriseEl, sunsetEl)

    // Cache indicator
    const city = getCity()
    if (city && isCached(city)) {
        const age = getCacheAge(city)
        const cachedEl = document.createElement('p')
        cachedEl.textContent = `📦 Cached data (${age} min ago)`
        cachedEl.style.color = '#718096'
        cachedEl.style.fontSize = '0.85rem'
        cachedEl.style.fontStyle = 'italic'
        weatherDisplay.appendChild(cachedEl)
    }
}

export function renderForecast(forecast) {
    if (!forecast || forecast.length === 0) {
        forecastContainer.innerHTML = '<p>No forecast available</p>'
        return
    }

    const unit = getUnit()
    forecastContainer.innerHTML = ''

    forecast.forEach(day => {
        const card = document.createElement('div')
        card.className = 'forecast-card'

        const date = new Date(day.date)
        const dayEl = document.createElement('p')
        dayEl.className = 'day'
        dayEl.textContent = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

        const iconEl = document.createElement('p')
        iconEl.className = 'icon'
        iconEl.textContent = day.icon

        const maxVal = unit === 'F' ? (day.maxTemp * 9/5 + 32).toFixed(1) : day.maxTemp
        const minVal = unit === 'F' ? (day.minTemp * 9/5 + 32).toFixed(1) : day.minTemp

        const maxEl = document.createElement('p')
        maxEl.className = 'max'
        maxEl.textContent = `${maxVal}°${unit}`

        const minEl = document.createElement('p')
        minEl.className = 'min'
        minEl.textContent = `${minVal}°${unit}`

        const descEl = document.createElement('p')
        descEl.className = 'desc'
        descEl.textContent = day.description

        card.append(dayEl, iconEl, maxEl, minEl, descEl)
        forecastContainer.appendChild(card)
    })
}

export function renderHistory(history) {
    if (!history || history.length === 0) {
        historyList.innerHTML = '<li>No searches yet</li>'
        return
    }

    historyList.innerHTML = ''
    history.forEach(city => {
        const li = document.createElement('li')
        li.textContent = city
        li.dataset.city = city
        historyList.appendChild(li)
    })
}

export function renderSuggestions(cities) {
    suggestionsContainer.innerHTML = ''
    if (!cities || cities.length === 0) {
        suggestionsContainer.style.display = 'none'
        return
    }

    suggestionsContainer.style.display = 'block'
    cities.forEach(city => {
        const item = document.createElement('div')
        item.className = 'suggestion-item'
        item.textContent = `${city.name}, ${city.country}`
        item.dataset.city = city.name
        item.dataset.country = city.country
        suggestionsContainer.appendChild(item)
    })
}

export function hideSuggestions() {
    suggestionsContainer.innerHTML = ''
    suggestionsContainer.style.display = 'none'
}

export function showError(message) {
    weatherDisplay.innerHTML = `<p class="error">❌ ${message}</p>`
}
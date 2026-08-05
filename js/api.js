// API - Weather Service

import { API } from "./constant.js";
import { mapForecastResponse, mapWeatherData } from "./weatherMapper.js";
import { getFromCache, saveToCache, isCached } from "./cache.js";

export async function getWeather(cityName) {
    if (isCached(cityName)) {
        console.log(`📦 Cache hit for ${cityName}`)
        return getFromCache(cityName)
    }

    try {
        const GEO_URL = `${API.GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        const geoResponse = await fetch(GEO_URL)

        if (!geoResponse.ok) {
            throw new Error('Failed to retrieve data. Check Internet Connection')
        }

        const geoData = await geoResponse.json()

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found')
        }

        const location = geoData.results[0]
        const { name, latitude, longitude, country } = location

        const WEATHER_URL = `${API.BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&daily=sunrise,sunset&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=5`
        const weatherResponse = await fetch(WEATHER_URL)

        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch data. Please check network connection')
        }

        const weatherData = await weatherResponse.json()

        if (!weatherData.current_weather) {
            throw new Error('Failed to retrieve data')
        }

        const mappedWeather = mapWeatherData(weatherData, name, country)
        const forecast = mapForecastResponse(weatherData)

        const result = { weather: mappedWeather, forecast }
        saveToCache(cityName, result)

        return result

    } catch (error) {
        console.error('❌ getWeather error:', error)
        throw error
    }
}

export async function searchCities(query) {
    if (!query || query.length < 2) return []

    try {
        const url = `${API.GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
        const response = await fetch(url)

        if (!response.ok) return []

        const data = await response.json()

        if (!data.results || data.results.length === 0) return []

        return data.results.map(result => ({
            name: result.name,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude
        }))

    } catch (error) {
        console.error('❌ Search cities error:', error)
        return []
    }
}
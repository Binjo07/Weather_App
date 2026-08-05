//state.js
export const state = {
    city: '',
    weather: null,
    forecast: null,
    loading: false,
    error: null,
    unit: 'C',
    history: [],
    cache : {}

}

export function getWeather(){
    return state.weather
}

export function getCity(){
    return state.city
}

export function getUnit(){
    return state.unit
}
export function getError(){
    return state.error
}
export function isLoading(){
  return state.loading
}
export function getHistory(){
    return state.history
}

export function getForecast(){
    return state.forecast
}

export function setForecast(forecast){
    state.forecast = forecast
}

export function setWeather(data){
    state.weather = data
}
export function setCity(city){
    state.city = city
}

export function setError(error){
    state.error = error
}

export function setLoading (loading){
    state.loading = loading
}
export function setUnit (unit){
    state.unit = unit
    localStorage.setItem('weatherUnit', unit)
}

export function setHistory(history){
    state.history = history
}

export function clearError(error){
    state.error = null
}
console.log('state.js loaded')
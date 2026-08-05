//app.js
import { renderWeather, renderHistory, showError, renderForecast, renderSuggestions, hideSuggestions } from "./renderer.js"; 
import { weatherDisplay, searchBtn, searchInput, historyList, unitToggle, suggestionsContainer  } from "./dom.js";
import { setWeather,getUnit, setLoading, setCity, setHistory, getHistory, clearError, setUnit, setForecast, getForecast } from "./state.js";
import { getWeather,searchCities } from "./api.js";
import { loadHistory, addHistory, saveHistory } from './storage.js'
import { debounce } from "./utils.js";

async function handleSearchInput(e){
    const query = e.target.value.trim()
    if(query.length < 2){
        hideSuggestions()
        return
    }
    const cities = await searchCities(query)
    renderSuggestions(cities)
}

function handleSuggestionClick(e){
    const item = e.target.closest('.suggestion-item')
    if (!item) return
    const city = item.dataset.city
    const country = item.dataset.country
    searchInput.value = city
    hideSuggestions()
    handleSearch(city)
}

function handleKeydown(e){
    if (e.key === 'Escape'){
        hideSuggestions()
    }
}

function handleClickOutside(e){
    if (!e.target.closest('#searchSection')){
        hideSuggestions()
    }
}
async function handleSearch (city){
    const searchCity = city || searchInput.value.trim()
    if (!searchCity){
        showError('Please enter a city name')
        return
    }
    console.log('handleSearch called with city:', searchCity)
    try{
        console.log('setting loading state to true')
        setLoading(true)
        console.log('fetching weather for city:', searchCity)
        searchBtn.disabled = true
        clearError()
        const weatherData = await getWeather(searchCity)
        console.log('Weather data fetched:', weatherData)
        setCity(searchCity)
        setWeather(weatherData.weather)
        setForecast(weatherData.forecast)
        setLoading(false)
        const currentHistory = getHistory()
        const updatedHistory = addHistory(searchCity, currentHistory)
        setHistory(updatedHistory)
        renderWeather()
        renderHistory(updatedHistory)
        renderForecast(getForecast())
    } catch(error){
        showError(error.message || 'Failed to fetch weather, Please try again')
    } finally {
        setLoading(false)
        searchBtn.disabled = false
    }
}

function toggleUnit(event){
    console.log('toggleUnit called')
    if (event) event.stopPropagation()
    const currentUnit = getUnit()
    const newUnit = currentUnit === 'C' ? 'F' : 'C'
    setUnit(newUnit)
    unitToggle.textContent = `°${newUnit} / °${currentUnit}`
    renderWeather()
}
function handleHistoryClick(event){
    const li = event.target.closest('li')
    if (!li) return

    const city = li.dataset.city
    if (city) {
        searchInput.value = city
        handleSearch(city)
    }
}

const debuncedSearchInput = debounce(handleSearchInput, 500)
searchInput.addEventListener('input', debuncedSearchInput)
suggestionsContainer.addEventListener('click', handleSuggestionClick)
document.addEventListener('keydown', handleKeydown)
document.addEventListener('click', handleClickOutside)
searchBtn.addEventListener('click', ()=> handleSearch())
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        handleSearch()
    }
})
unitToggle.addEventListener('click', toggleUnit)

historyList.addEventListener('click', handleHistoryClick)





function init(){
    console.log('Weather Dashboard Initialized')
    const savedHistory = loadHistory()
    setHistory(savedHistory)
    renderHistory(savedHistory)
    searchInput.focus()
    console.log('APP READY')
}

init()
let history = []
export function saveHistory(history){
    history = localStorage.setItem('weatherHistory', JSON.stringify(history))
}

export function loadHistory(history){
    return JSON.parse(localStorage.getItem('weatherHistory')) || []
}

export function addHistory (city, currentHistory){
 const filteredHistory = currentHistory.filter(item=> item !== city)
 filteredHistory.unshift(city)
 const limitedHistory = filteredHistory.slice(0,5)
 saveHistory(limitedHistory)
 return limitedHistory 
}
import { CACHE } from "./constant.js";

export function saveToCache(city, data){
    const cache = {
        data: data,
        timestamp: Date.now()
    }
    let cached = loadCache()
    cached[city.toLowerCase()] = cache
    localStorage.setItem('weatherCache', JSON.stringify(cached))
}

export function loadCache(){
    const stored = localStorage.getItem('weatherCache')
    return stored ? JSON.parse(stored) : {}
}

export function getFromCache(city){
    const cached = loadCache()
    const key = city.toLowerCase()
    if (!cached[key]){
        return null
    }
    const entry = cached[key]
    const age = Date.now() - entry.timestamp
    const isExpired = age > CACHE.TTL

    if (isExpired){
        delete cached[key]
        
    localStorage.setItem('weatherCache', JSON.stringify(cached))
    return null
    }
    return entry.data

}

export function isCached(city){
    const cached = loadCache()
    const key = city.toLowerCase()
    if (!cached[key]){
        return false
    }
    const age = Date.now() - cached[key].timestamp
    return age <= CACHE.TTL
}

export function getCacheAge(city){
    const cached = loadCache()
    const key = city.toLowerCase()
    if(!cached[key]){
        return null
    }
    const age = Date.now() - cached[key].timestamp
    return Math.round(age/60000)
}

console.log('cache.js loaded')
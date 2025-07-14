import api from "./api"
export const login = () =>{
    return api.post('https://dummyjson.com/auth/login')
}

export const logout = () => {
    return api.post('/logout')
}

export const register = () => {
    return api.post('/register')
}
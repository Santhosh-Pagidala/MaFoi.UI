import jwtDecode from "jwt-decode";

export function getAuthToken() {
    return sessionStorage.getItem('auth-token') || null;
}

export function setAuthToken(token) {
    sessionStorage.setItem('auth-token', token);
}

export function clearAuthToken() {
    sessionStorage.removeItem('auth-token');
}

export function getUserDetails() {
    const token = getAuthToken();
    if (token) {
        return jwtDecode(token);
    }
    return null;
}
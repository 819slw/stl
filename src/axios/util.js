import Cookies from 'js-cookie'

export const TOKEN_KEY = 'token'

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY);
    if (token && token !== 'undefined') {
        return token;
    } else {
        return false;
    }
};

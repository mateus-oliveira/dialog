export const FEED = '/feed'
export const LOGIN = '/login';
export const PROFILE = '/profile';
export const REGISTER = '/register';

// Backend routes
export const API_LOGIN = '/login';
export const API_REGISTER = '/register';
export const API_POSTS = '/posts';


export default {
    PRIVATE_ROUTES: [PROFILE, FEED],
    PUBLIC_ROUTES: [LOGIN, REGISTER],
}

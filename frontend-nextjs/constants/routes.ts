export const FEED = '/feed'
export const LOGIN = '/login';
export const PROFILE = '/profile';
export const REGISTER = '/register';


export default {
    PRIVATE_ROUTES: [PROFILE, FEED],
    PUBLIC_ROUTES: [LOGIN, REGISTER],
}

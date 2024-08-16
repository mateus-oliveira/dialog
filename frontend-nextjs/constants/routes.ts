export const FEED = '/feed'
export const LOGIN = '/login';
export const PROFILE = '/profile';
export const REGISTER = '/register';
export const CREATE_POST = '/create-post';

// Backend routes
export const API_LOGIN = '/login';
export const API_REGISTER = '/register';
export const API_POSTS = '/posts';
export const API_COMMENTS = '/comments';
export const API_LIKES = '/likes';


export default {
    PRIVATE_ROUTES: [PROFILE, FEED, CREATE_POST],
    PUBLIC_ROUTES: [LOGIN, REGISTER],
}

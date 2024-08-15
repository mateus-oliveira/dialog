import routes from '../constants/routes';

const authenticationRequired = (route) => {
  return routes.PRIVATE_ROUTES.includes(route);
};

export default authenticationRequired;

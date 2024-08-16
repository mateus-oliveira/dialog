import { useEffect } from "react";
import {LOGIN} from "../../constants/routes";
import isUserAuthenticated from "../../utils/isUserAuthenticated";

const PrivateRoute = ({children}) => {
    const isAuthenticated = isUserAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) {
            window.location.href = LOGIN;
        }
    }, [isAuthenticated]);

    return (
        <>
            {isAuthenticated ? children : null}
        </>
    )
}


export default PrivateRoute;

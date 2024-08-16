import { useEffect } from "react";
import { FEED } from "@/constants/routes";
import isUserAuthenticated from "@/utils/isUserAuthenticated";


const PublicRoute = ({children}) => {
    const isAuthenticated = isUserAuthenticated();

    useEffect(() => {
        if (isAuthenticated) {
            window.location = FEED;
        }
    }, [isAuthenticated]);

    return (
        <>
            {isAuthenticated ? null : children}
        </>
    )
}


export default PublicRoute;

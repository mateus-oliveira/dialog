import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {LOGIN} from "../../constants/routes";
import isUserAuthenticated from "../../utils/isUserAuthenticated";

const PrivateRoute = ({children}) => {
    const { push } = useRouter();
    const isAuthenticated = isUserAuthenticated();

    useEffect(() => {
        if (!isAuthenticated) {
            push(LOGIN)
        }
    }, [isAuthenticated, push]);

    return (
        <>
            {isAuthenticated && children}
            {!isAuthenticated && null}
        </>
    )
}


export default PrivateRoute;

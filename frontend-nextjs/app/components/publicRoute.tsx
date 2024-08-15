import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FEED } from "@/constants/routes";
import isUserAuthenticated from "@/utils/isUserAuthenticated";


const PublicRoute = ({children}) => {
    const { push } = useRouter();
    const isAuthenticated = isUserAuthenticated();

    useEffect(() => {
        if (isAuthenticated) {
            push(FEED)
        }
    }, [isAuthenticated, push]);

    return (
        <>
            {!isAuthenticated && children}
            {isAuthenticated && null}
        </>
    )
}


export default PublicRoute;

import { TOKEN } from "@/constants/storage";

export const isUserAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN);
        return !!token;
    };

    return false;
};

export default isUserAuthenticated;

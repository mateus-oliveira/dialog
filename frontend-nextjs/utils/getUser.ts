import { USER } from "@/constants/storage"

const getUser = () => {
    return JSON.parse(localStorage.getItem(USER));
}

export default getUser;

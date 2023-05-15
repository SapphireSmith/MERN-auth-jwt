import axios from "axios";
import { useEffect, useState } from 'react';

import { getUsername } from "../helper/helpers";

axios.defaults.baseURL = 'https://auth-backend-w15s.onrender.com';

const useFetch = (query) => {
    const [data, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

    useEffect(() => {


        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }))

                const { username } = !query ? await getUsername() : '';

                const { data, status } = !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`)

                if (status === 200) {
                    setData(prev => ({ ...prev, isLoading: false, apiData: data, status: status }))
                }

                setData(prev => ({ ...prev, isLoading: false }))
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }));
            }
        }
        fetchData();
    }, [query]);

    return [data, setData]
}

// export the useFetch
export default useFetch;

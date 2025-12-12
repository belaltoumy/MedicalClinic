import axios from "axios";
const BASE_URL = 'http://medicalclinicapi.runasp.net';
import { storeToRefs } from 'pinia';
import { dataUserStore } from '../store/dataUser';
const store = dataUserStore();
const { getToken } = storeToRefs(store);
const apiClient = axios.create({
    baseURL: BASE_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    timeout: 50000
});

const getHeaders = () => ({
    headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token')
        // token : getToken.value
    }
});
const getHeadersUpload = () => ({
    headers: {
        'Content-Type': "multipart/form-data",
        token: localStorage.getItem('token')
        // token : getToken.value
    }
});

// const _get = async (url) => {
//     try {
//         return await apiClient.get(url, getHeaders());
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };
const _get = async (url, config = {}) => {
  try {
    return await apiClient.get(url, { ...getHeaders(), ...config });
  } catch (error) {
    throw new Error(error.message);
  }
};

const _getWithBody = async (url, data = {}) => {
    try {
        return await apiClient.get(url, data, getHeaders());
    } catch (error) {
        throw new Error(error.message);
    }
};

const _delete = async (url, params = {}) => {
    try {
        return await apiClient.delete(url, {
            ...getHeaders(),
            params,
        });
    } catch (error) {
        throw new Error(error.message);
    }
};


const _put = async (url, data = {}) => {
    try {
        const response = await apiClient.put(url, data, getHeaders());

        if (response.status >= 200 && response.status < 300) {
            return response;
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error(error.message);
        }
    }
};

const _post = async (url, data = {}) => {
    try {
        const response = await apiClient.post(url, data, getHeaders());

        if (response.status >= 200 && response.status < 300) {
            return response;
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error(error.message);
        }
    }
};


const _upload = async (url, data = {}) => {
    try {
        const response = await apiClient.post(url, data, getHeadersUpload());

        if (response.status >= 200 && response.status < 300) {
            return response;
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data);
        } else {
            throw new Error(error.message);
        }
    }
};

const postFetch = async (url, body) => {

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), 1200000);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: body,
            headers: {
                token: localStorage.getItem('token'),
                // token : getToken.value
            },
            signal, 
        });

        clearTimeout(timeoutId); 

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw new Error(error.message);
    }
};

const getFetch = async (url) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), 1200000);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token'),
            },
            signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw new Error(error.message);
    }
};

export { _get, _delete, _put, _post, _getWithBody, _upload, postFetch, getFetch };

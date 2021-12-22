import axiosClient from './axiosClient';

export const authApi = {
    async getData(url, token) {
        const res = await axiosClient.get(`api/${url}`, {
            headers: { Authorization: token },
        });

        return res;
    },
    async postData(url, post, token) {
        const res = await axiosClient.post(`api/${url}`, post, {
            headers: { Authorization: token },
        });
        return res;
    },
    async putData(url, post, token) {
        const res = await axiosClient.put(`api/${url}`, post, {
            headers: { Authorization: token },
        });
        return res;
    },
    async patchData(url, post, token) {
        const res = await axiosClient.patch(`api/${url}`, post, {
            headers: { Authorization: token },
        });
        return res;
    },
    async deleteData(url, token) {
        const res = await axiosClient.delete(`api/${url}`, {
            headers: { Authorization: token },
        });
        return res;
    },
};

import axios from 'axios';

const url = 'http://localhost:3000/maps';

class APIService {

    static async getAllMaps() {
        try {
            const res = await axios.get(url);
            const data = res.data;
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    static createMap() {
        return axios.post(url, {
            name: 'testName',
            active: false
        });
    }
}

export default APIService;
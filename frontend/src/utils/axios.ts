import Axios from "axios";

const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;

import axios from "axios";
import { env } from "process";
const axiosFetch = axios.create({ baseURL: env.BASE_URL });
export default axiosFetch;

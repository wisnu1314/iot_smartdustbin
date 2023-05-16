import axios from "axios";
import { env } from "process";
const axiosFetch = axios.create({ baseURL: "http://localhost:8001/" });
export default axiosFetch;

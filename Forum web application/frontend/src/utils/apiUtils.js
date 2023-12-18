import axios from "axios";
import { baseURL } from "./constant";

// This function is for asking the server to refresh the access token when
// it is expired, given that the user has a valid refresh token stored in an Http-only cookie
export const refreshToken = async () => {
  try {
    const config = {
      withCredentials: true,
    };
    const response = await axios.get(`${baseURL}/refreshToken`, config);
    console.log("refresh token response status: " + response.status);
    const newAccessToken = response.data.accessToken;
    if (newAccessToken) {
      localStorage.setItem("token", newAccessToken);
    }
    return newAccessToken;
  } catch (error) {
    return new Error("error while refreshing token !: " + error);
  }
};

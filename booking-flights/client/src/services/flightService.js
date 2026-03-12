import axios from "axios";

const API_URL = "http://localhost:5003/api/flights";

export const getAllFlights = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getFlightById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const searchFlights = async (searchParams) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: searchParams,
  });
  return response.data;
};
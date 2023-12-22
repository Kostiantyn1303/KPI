import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import bcrypt from "bcryptjs";
const BASE_ID = process.env.NEXT_PUBLIC_BASE_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const TABLE_NAME = "costumers";

const axiosInstance = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const getRecords = async () => {
  try {
    const response = await axiosInstance.get("/costumers");
    return response.data.records;
  } catch (error) {
    console.error("Error fetching records from Airtable:", error);
    throw error;
  }
};
export const createRecord = async (data) => {
  try {
    const response = await axiosInstance.post(`/${TABLE_NAME}`, {
      fields: data,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating record in Airtable:", error);
    throw error;
  }
};
export const updateRecord = async (recordId, data) => {
  try {
    const response = await axiosInstance.patch(`/${TABLE_NAME}/${recordId}`, {
      fields: data,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating record in Airtable:", error);
    throw error;
  }
};
export const deleteRecord = async (recordId) => {
  try {
    const response = await axiosInstance.delete(`/${TABLE_NAME}/${recordId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting record in Airtable:", error);
    throw error;
  }
};
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function createRecordWithHashedPassword(data) {
  const users = await getRecords();
  const existingUser = users.find((user) => user.fields.email === data.email);

  if (existingUser) {
    // Користувач з таким email вже існує, поверніть помилку або обробіть її
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  try {
    const response = await axiosInstance.post(`/${TABLE_NAME}`, {
      fields: { ...data, password: hashedPassword },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating record in Airtable:", error);
    throw error;
  }
}

export { hashPassword, createRecordWithHashedPassword };

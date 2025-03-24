import React from "react";
import { View } from "react-native";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as hobbyService from "../../services/hobbyService";



// Add component definition
const HobbyListScreen: React.FC = () => {
  return <View>{/* Your component content */}</View>;
};

// Define proper return type and error handling
export const getAllHobbies = createAsyncThunk(
  "hobby/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getAllHobbies();
      return response; //remove .data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch hobbies" }
      );
    }
  }
);

export const getHobbyById = createAsyncThunk(
  "hobby/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getHobby(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to fetch hobby" }
      );
    }
  }
);

// Properly type the hobby data
interface CreateHobbyData {
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  image?: string | null;
}

export const createHobby = createAsyncThunk(
  "hobby/create",
  async (hobbyData: CreateHobbyData, { rejectWithValue }) => {
    try {
      const response = await hobbyService.createHobby(hobbyData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { error: "Failed to create hobby" }
      );
    }
  }
);

// Add default export
export default HobbyListScreen;

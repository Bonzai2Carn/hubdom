// src/controllers/dataController.js

/**
 * Add data
 * @route POST /api/v1/data
 * @access Public
 */
const addData = (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({
        success: false,
        error: "Data is required",
      });
    }
    console.log("Received data:", data);
    res.status(201).json({
      success: true,
      message: "Data received successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error in addData:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

/**
 * Get data
 * @route GET /api/v1/data
 * @access Public
 */
const getData = (req, res) => {
  try {
    // Mock data for now
    const sampleData = [
      { id: 1, name: "Sample Item 1", value: "Value 1" },
      { id: 2, name: "Sample Item 2", value: "Value 2" },
    ];

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: sampleData,
    });
  } catch (error) {
    console.error("Error in getData:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving data",
      error: error.message,
    });
  }
};

/**
 * Update data
 * @route PUT /api/v1/data/:id
 * @access Public
 */
const updateData = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID parameter is required",
      });
    }

    res.status(200).json({
      success: true,
      message: `Data with ID ${id} updated successfully`,
      data: { id, ...updates },
    });
  } catch (error) {
    console.error("Error in updateData:", error);
    res.status(500).json({
      success: false,
      message: "Error updating data",
      error: error.message,
    });
  }
};

/**
 * Delete data
 * @route DELETE /api/v1/data/:id
 * @access Public
 */
const deleteData = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "ID parameter is required",
      });
    }

    res.status(200).json({
      success: true,
      message: `Data with ID ${id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error in deleteData:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting data",
      error: error.message,
    });
  }
};

module.exports = {
  addData,
  getData,
  updateData,
  deleteData,
};

import bcrypt from "bcrypt";

const EditSpecificUser = async (db, req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, phone, address, password } = req.body;

    // Log the received data
    console.log("Received request to edit user with ID:", userId);
    console.log("Request body:", req.body);

    // Hash the new password before updating it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log the hashed password
    console.log("Hashed password:", hashedPassword);

    // Execute SQL query to update user information in the database
    const [result] = await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?, password = ? WHERE id = ?",
      [firstName, lastName, email, phone, address, hashedPassword, userId]
    );

    // Check if the update was successful
    if (result.affectedRows === 0) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Log success message
    console.log("User information updated successfully");

    // Return a success message if the update was successful
    res.json({ message: "User information updated successfully" });
  } catch (error) {
    // Log error message
    console.error("Error updating user information:", error);

    // Send error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default EditSpecificUser;

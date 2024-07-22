const EditUserStatus = async (db, req, res) => {
  const { id, status } = req.body;

  try {
    console.log(`Received request to update status for user ${id} to ${status}`);

    const result = await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
    
    console.log(`User with ID ${id} status updated successfully!`);


    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error updating user status: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default EditUserStatus;

const DeleteUser = async (db, req, res) => {
    const { id } = req.body;
  
    try {
      await db.query("DELETE FROM users WHERE id = ?", [id]);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export default DeleteUser;
  
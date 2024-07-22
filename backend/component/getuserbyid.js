const GetUserById = async (req, res) => {
    try {
      const userId = req.body.userId; // Extract userId from the request body
      const [results] = await global.pool.query(
        "SELECT * FROM users WHERE id = ?",
        [userId]
      );
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(results[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  
  export default GetUserById;
  
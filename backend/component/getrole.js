const Getrole = async (req, res) => {
  const { id } = req.params;

  // Parse the id to ensure it is a valid integer
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Query the database to fetch the user's role based on the provided ID
  const query = "SELECT role FROM users WHERE id = ?";

  db.query(query, [userId])
    .then(([results]) => {
      if (results.length > 0) {
        const role = results[0].role;
        res.json({ role });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.error("Error fetching role from database:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

export default Getrole;

export const checkEmail = async (db,req, res) => {
    try {
      const { email } = req.query;
  
      if (!email) {
        return res.status(400).json({ error: "Email parameter is required" });
      }
  
      const [results] = await db.query("SELECT * FROM clients WHERE email = ?", [email]);
  
      if (results.length > 0) {
        res.json({ isUnique: false });
      } else {
        res.json({ isUnique: true });
      }
    } catch (error) {
      console.error("Error checking email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
// getUserImage.js

const getUserImage = async (db, req, res) => {
    try {
      // Extract the userId from the request parameters
      const { userId } = req.params;
      
      // Fetch the image path from the database based on the userId
      const query = "SELECT image FROM users WHERE id = ?";
      const [rows] = await db.query(query, [userId]);
  
      // Check if the user exists and has an image path
      if (rows.length > 0 && rows[0].image) {
        const imagePath = rows[0].image;
        
        // Send the image path as a response
        res.json({ imagePath });
      } else {
        // If user not found or no image path exists, send an error response
        res.status(404).json({ error: "User not found or image not available" });
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
      res.status(500).json({ error: "Failed to fetch user image" });
    }
  };
  
  export default getUserImage;
  
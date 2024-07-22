const uploadImage = async (db,req, res) => {
    try {
      const filePath = req.file.filename; // Get the path of the uploaded file
      console.log("Uploaded file path:", filePath); // Log the file path
  
      // Retrieve the user ID from the request body
      const userId = req.body.userId;
  console.log(userId)
      // Update the image column in the users' database table
      const updateUserImageQuery = `UPDATE users SET image = ? WHERE id = ?`;
      await db.query(updateUserImageQuery, [filePath, userId]);
  
      // Send a success response back to the client
      res.status(200).json({ message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Error uploading image:", error);
      // Send an error response back to the client
      res.status(500).json({ error: "Failed to upload image" });
    }
  };
  
  export default uploadImage;
  
import jwt from "jsonwebtoken";
const updateProfileProfile = async (db, req, res) => {
  // Check if 'Authorization' header exists
  if (!req.headers.authorization) {
    console.error("Authorization header missing");
    return res
      .status(401)
      .json({ Status: "error", Message: "Authorization header missing" });
  }

  // Extract the token from the 'Authorization' header
  const token = req.headers.authorization.split(" ")[1];
  console.log("Token on the Backend:", token);

  try {
    // Decode the token and extract the user ID
    const decodedToken = jwt.decode(token); // Use jwt.decode for simplicity

    console.log("Decoded Token:", decodedToken);

    if (decodedToken && decodedToken.userId) {
      const userId = decodedToken.userId;

      // Check if 'filename' is available in req
      if (!req.file || !req.file.filename) {
        console.error("Filename not available in the request");
        return res.status(400).json({
          Status: "error",
          Message: "Filename not available in the request",
        });
      }

      const image = req.file.filename;
      const sql = "UPDATE users SET image = ? WHERE id = ?";
      console.log(image);
      db.query(sql, [image, userId], (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ Status: "error", Message: "Internal server error" });
        }
        return res.json({ Status: "success" });
      });
    } else {
      console.log("Failed to decode token or extract userid");
      return res.status(401).json({
        Status: "error",
        Message: "Failed to decode token or extract userid",
      });
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return res
      .status(401)
      .json({ Status: "error", Message: "Error decoding token" });
  }
};

export default updateProfileProfile;

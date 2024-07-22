import bcrypt from "bcrypt";

const UpdatePassword = async (db, req, res) => {
  const { token, newPassword } = req.body;
  console.log("New password:", newPassword);
  // Check if the token exists and is not expired
  const checkTokenQuery =
    "SELECT * FROM reset_tokens WHERE token = ? AND expires > UNIX_TIMESTAMP(NOW()) * 1000;";

  try {
    const tokenResults = await db.query(checkTokenQuery, [token]);

    const userEmail = tokenResults[0][0].email;
    console.log("Token result", userEmail);

    if (tokenResults.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in the database with the hashed password
    const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ?";
    await db.query(updatePasswordQuery, [hashedPassword, userEmail]);
    // Delete used token from the database
    const deleteTokenQuery =
      "DELETE FROM reset_tokens WHERE email = ? AND token = ?";
    await db.query(deleteTokenQuery, [userEmail, token]);

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while resetting the password" });
  }
};

export default UpdatePassword;

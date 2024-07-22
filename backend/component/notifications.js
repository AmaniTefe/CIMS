export default async function Notifications(db, req, res) {
  try {
    // Extract user ID from the authorization token
    const token = req.headers.authorization;
    if (!token) {
      console.error("Token is not available");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [, tokenValue] = token.split(" ");
    const user = JSON.parse(atob(tokenValue.split(".")[1]));
    const userId = user.userId;

    // Query the database to retrieve notifications for the user
    const sql = `SELECT * FROM notifications WHERE user_id = ? AND status = true`;
    const notifications = await db.query(sql, [userId]);

    res.json(notifications[0]); // Return only the inner array containing notification objects
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

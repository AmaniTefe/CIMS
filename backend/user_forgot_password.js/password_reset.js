import crypto from "crypto";
import transporter from "./node_mailer.js";

const ResetPassword = async (db, req, res) => {
  const { email } = req.body;

  try {
    // Execute the SQL query to fetch user data based on the provided email
    const getUserQuery = "SELECT * FROM users WHERE email = ?";
    const [userData, userFields] = await db.query(getUserQuery, [email]);
    console.log("Executing SQL query:", getUserQuery); // Log the SQL query
    console.log("Email:", email);
    console.log("User data:", userData); // Log the user data

    // If no user found with the provided email, return 404
    if (userData.length === 0) {
      console.log("User not found"); // Log message if user not found
      return res.status(404).json({ message: "User not found" });
    }

    let token;
    let expires;

    // Ensure the generated token is unique
    do {
      token = crypto.randomBytes(20).toString("hex");
      console.log(token)
      const checkTokenQuery = "SELECT * FROM reset_tokens WHERE token = ?";
      const [tokenData, tokenFields] = await db.query(checkTokenQuery, [token]);
      console.log("Executing SQL query:", checkTokenQuery); // Log the SQL query for token check
      console.log("Token data:", tokenData); // Log the token data
      if (tokenData.length === 0) {
        // If token is unique, break from the loop
        break;
      }
    } while (true);

    expires = Date.now() + 3600000; // Token expires in 1 hour

    // Insert token into the reset_tokens table
    const insertTokenQuery =
      "INSERT INTO reset_tokens (email, token, expires) VALUES (?, ?, ?)";
    await db.query(insertTokenQuery, [email, token, expires]);
    console.log("Executing SQL query:", insertTokenQuery); // Log the SQL query for token insertion

    // Send reset email with the token link
    const resetLink = `http://localhost:3000/user/resetPassword/${token}`;
    const mailOptions = {
      from: "henokbasa1221@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
      <p>Thank you for registering! Click the button below to confirm your email:</p>
      <a href="${resetLink}">
        <button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor:pointer">
          Confirm Email
        </button>
      </a>
    `,
    };

    // Send the email
    transporter.sendMail(mailOptions, async (mailError) => {
      if (mailError) {
        console.error("Error sending reset email:", mailError); // Log error if sending email fails
        return res.status(500).json({ message: "Failed to send reset email" });
      }

      // Set a timeout to remove the token after one hour
      setTimeout(async () => {
        const deleteTokenQuery = "DELETE FROM reset_tokens WHERE token = ?";
        await db.query(deleteTokenQuery, [token]);
        console.log("Executing SQL query:", deleteTokenQuery); // Log the SQL query for token deletion
      }, 3600000);

      return res.json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error("Database error:", error); // Log database error
    return res.status(500).json({ message: "Database error" });
  }
};

export default ResetPassword;

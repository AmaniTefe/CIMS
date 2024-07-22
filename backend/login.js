import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "k0PJbIobltNQ4zlgiu_Gtpo0iZVQ9IytOsjR7so9CoM";

export default async function Login(db, req, res) {
  try {
    const { email, password } = req.body;

    // Check if the user exists with the provided email
    const userQuery = "SELECT * FROM users WHERE email = ?";

    const [userResults] = await db.query(userQuery, [email]);

    if (userResults.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(
      password,
      userResults[0].password
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Extract user information
    const { id, first_name, role, last_name, status } = userResults[0];

    // If role_name is null, assign it as 'student'
    const userRole = role;

    // Generate a JWT token for authentication with additional user information
    const token = jwt.sign(
      {
        userId: id,
        first_name: first_name,
        last_name: last_name,
        email,
        role_name: userRole,
        status,
      },
      SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Send the token as a response to the client along with user information
    res.status(200).json({
      success: true,
      token,
      user: { id, first_name, last_name, email, role_name: userRole, status },
    });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
}

import bcrypt from "bcrypt";
const AddUser = async (db, req, res) => {
  const userData = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Insert data into the users table
    const [userResults] = await db.query("INSERT INTO users SET ?", {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      address: userData.address,
      password: hashedPassword,
      role: userData.role,
      status: "activated",
    });

    // If the user's role is Judge and judge_type is not null, insert into users_judge_type table
    if (userData.role === "Judge" && userData.judge_type) {
      await db.query("INSERT INTO users_judge_type (judge_type, judge_id) VALUES (?, ?)", [
        userData.judge_type,
        userResults.insertId,
      ]);
    }

    res.json({
      message: "User created successfully",
      userId: userResults.insertId,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    // Check for duplicate entry error and handle it gracefully
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default AddUser;

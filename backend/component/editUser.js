const EditUser = async (db, req, res) => {
  const userData = req.body;

  try {
    // Check if the role is "Judge"
    if (userData.role === "Judge") {
      // Check if the judge_id exists in users_judge_type table
      const judgeTypeCheck = await db.query("SELECT * FROM users_judge_type WHERE judge_id = ?", [userData.id]);

      if (judgeTypeCheck.length === 0) {
        // If judge_id does not exist, insert into users_judge_type
        await db.query("INSERT INTO users_judge_type (judge_type, judge_id) VALUES (?, ?)", [userData.judgeType, userData.id]);
      } else {
        // If judge_id exists, update judge_type
        await db.query("UPDATE users_judge_type SET judge_type = ? WHERE judge_id = ?", [userData.judgeType, userData.id]);
      }
    }

    // Update only the users table
    const { judgeType, ...userDataWithoutJudgeType } = userData; // Remove judgeType from userData if present
    await db.query("UPDATE users SET ? WHERE id = ?", [userDataWithoutJudgeType, userData.id]);

    res.json({ message: "User edited successfully" });
  } catch (error) {
    console.error("Error editing user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default EditUser;

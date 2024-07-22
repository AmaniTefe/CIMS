const editAdvocate = async (db, req, res) => {
  const {
    id,
    first_name,
    middle_name,
    last_name,
    gender,
    email,
    mobile_number,
    address,
  } = req.body;
  console.log("Advocate ID to be edited:", id);
  console.log(req.body);
  try {
    // Update advocator in the database
    const updateAdvocateResult = await db.query(
      "UPDATE advocators SET first_name = ?, middle_name = ?, last_name = ?, gender = ?, email = ?, mobile_number = ?, address = ? WHERE advocator_id = ?",
      [
        first_name,
        middle_name,
        last_name,
        gender,
        email,
        mobile_number,
        address,
        id,
      ]
    );
    console.log("Result from updating advocate:", updateAdvocateResult);

    res.json({ message: "Advocate updated successfully" });
  } catch (error) {
    console.error("Error updating advocate: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default editAdvocate;

const AddCasesubType = async (db, req, res) => {
  const subtypedata = req.body;

  try {
    const [results] = await db.query(
      "INSERT INTO case_sub_type (case_type, sub_type_name) VALUES (?, ?)",
      [subtypedata.case_type, subtypedata.sub_type_name]
    );
    res.json({
      message: "Case sub Type inserted successfully",
      userId: results.insertId,
    });
  } catch (error) {
    console.error("Error inserting Case sub Type: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default AddCasesubType;

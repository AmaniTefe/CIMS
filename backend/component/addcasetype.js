const AddCaseType = async (db, req, res) => {
  const casetypedata = req.body;

  try {
    const [results] = await db.query("INSERT INTO case_type SET?", {
      case_type_name: casetypedata.case_type_name,
    });
    res.json({
      message: "case type inserted successfully",
      userId: results.insertId,
    });
  } catch (error) {
    console.error("Error creating case type: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default AddCaseType;

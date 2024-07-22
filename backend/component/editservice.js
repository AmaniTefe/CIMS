const EditService = async (db, req, res) => {
  const services = req.body;

  try {
    const result = await db.query("UPDATE services SET ? WHERE id = ?", [
      services,
      services.id,
    ]);
    console.log("sql result:", result);
    res.json({ message: "Service edited successfully" });
  } catch (error) {
    console.error("Error editing service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default EditService;

const DeleteCaseSubType = async (db, req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Case Sub Type ID is required" });
    }

    const deleteCaseSubTypeQuery = "DELETE FROM Case_sub_type WHERE id = ?";
    await db.query(deleteCaseSubTypeQuery, [id]);
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default DeleteCaseSubType;

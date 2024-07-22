const DeleteProscutorDocument = async (db, req, res) => {
  const { documentId } = req.body;
  console.log("Deleting document with ID:", documentId);
  try {
    const result = await db.query(
      "DELETE FROM prosecutor_documents WHERE id = ?",
      [documentId]
    );
    console.log("SQL Result:", result); // Add this line to log the SQL result
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document: ", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", sqlMessage: error.sqlMessage });
  }
};

export default DeleteProscutorDocument;

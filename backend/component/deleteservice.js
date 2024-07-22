const DeleteService = async (db, req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM services WHERE id =?", [id]);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default DeleteService;

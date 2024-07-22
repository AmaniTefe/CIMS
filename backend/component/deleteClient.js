const deleteClient = async (db, req, res) => {
  console.log("DELETE request received at /api/deleteClient");
  const clientId = req.body.id;

  try {
    // Delete from clientreference first
    const deleteRefResult = await db.query("DELETE FROM clientreferences WHERE client_id = ?", [clientId]);
    console.log("Result from deleting clientreferences:", deleteRefResult);

    // Then delete from clients
    const deleteClientResult = await db.query("DELETE FROM clients WHERE id = ?", [clientId]);
    console.log("Result from deleting client:", deleteClientResult);

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default deleteClient;

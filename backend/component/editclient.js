export default async function editClient(db, req, res) {
  const clientData = req.body;

  // Log the data sent from the frontend
  console.log("Data sent from frontend:", clientData);

  try {
    // Update clients table excluding references
    const { references, ...clientWithoutReferences } = clientData;

    // Update client information
    await db.query(
      "UPDATE clients SET ? WHERE id = ?",
      [clientWithoutReferences, clientData.id]
    );

    // Update reference information if provided
    if (references && references.length > 0) {
      // Use a loop to update each reference
      for (const reference of references) {
        // Check if the reference exists by checking its id
        if (reference.id) {
          await db.query(
            "UPDATE clientreferences SET reference_name = ?, reference_mobile = ? WHERE id = ?",
            [reference.reference_name, reference.reference_mobile, reference.id]
          );
        } else {
          // Handle the case if the reference id is not provided (Insertion or updating logic)
          // This part depends on your specific business logic
        }
      }
    }

    res.json({ message: "Client edited successfully" });
  } catch (error) {
    console.error("Error editing client: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

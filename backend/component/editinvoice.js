const AddInvoice = async (db, req, res) => {
  try {
    // Extract invoiceId from request parameters
    const { invoiceId } = req.params;

    // Extract data from request body
    const itemsToAdd = req.body;

    console.log("Data received from frontend:", itemsToAdd);

    // Check if invoiceId is provided
    if (!invoiceId) {
      return res.status(400).json({
        message: "Invoice ID is required",
      });
    }

    // Insert each item into the database
    const insertItemQuery =
      "INSERT INTO invoice_items (invoice_id, service, description, amount, paid_status) VALUES (?, ?, ?, ?, ?)";

    for (const item of itemsToAdd) {
      const { service, description, amount, paid_status } = item;
      const itemValues = [invoiceId, service, description, amount, paid_status];
      console.log("Item values sent to the database:", itemValues);
      await db.query(insertItemQuery, itemValues);
    }

    res.status(201).json({ message: "Invoice items created successfully" });
  } catch (error) {
    console.error("Error adding invoice items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default AddInvoice;

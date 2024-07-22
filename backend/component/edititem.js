const EditItem = async (db, req, res) => {
  try {
    const { itemId, description, paidStatus } = req.body;
    console.log(req.body);

    const query = `
        UPDATE invoice_items
        SET description = ?,
            paid_status = ?
        WHERE item_id = ?
      `;

    const values = [description, paidStatus, itemId];

    // Execute the SQL query
    const [result] = await db.query(query, values);
    console.log(result);

    if (result.changedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "Item updated successfully" });
    } else {
      res.status(404).json({ success: false, error: "Item not found" });
    }
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export default EditItem;

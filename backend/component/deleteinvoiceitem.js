const DeleteInvoiceItem = async (db, req, res) => {
  try {
    // Extract item id from request body
    const { itemId } = req.body;
    console.log(itemId);

    // Check if itemId is provided
    if (!itemId) {
      return res.status(400).json({
        message: "Item ID is required",
      });
    }

    // Delete the invoice item
    const deleteItemQuery = "DELETE FROM invoice_items WHERE item_id = ?";
    await db.query(deleteItemQuery, [itemId]);

    res.status(200).json({ message: "Invoice item deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default DeleteInvoiceItem;

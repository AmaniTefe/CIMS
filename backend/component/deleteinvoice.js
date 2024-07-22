const DeleteInvoice = async (db, req, res) => {
  try {
    const { invoiceId } = req.body;

    // Check if invoiceId is provided
    if (!invoiceId) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    // Delete invoice from invoices table (with cascading delete)
    const deleteInvoiceQuery = "DELETE FROM invoices WHERE invoice_id = ?";
    await db.query(deleteInvoiceQuery, [invoiceId]);
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default DeleteInvoice;

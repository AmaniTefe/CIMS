const GetInvoiceById = async (db, req, res) => {
  try {
    // Extract invoice ID from request parameters
    const { invoiceId } = req.params;
    console.log("Received invoiceId:", invoiceId);

    // SQL query to select invoice details by ID
    const selectInvoiceQuery = `
        SELECT * FROM invoices 
        WHERE invoice_id = ?;
      `;

    // Execute the SQL query to fetch the invoice details
    const [invoiceRows] = await db.query(selectInvoiceQuery, [invoiceId]);

    if (invoiceRows.length === 0) {
      // If no invoice is found with the provided ID, return a 404 status code
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Extract the first row as the invoice details
    const invoiceDetails = invoiceRows[0];

    // SQL query to select invoice items for the invoice
    const selectItemsQuery = `
        SELECT * FROM invoice_items 
        WHERE invoice_id = ?;
      `;

    // Execute the SQL query to fetch the invoice items
    const [itemRows] = await db.query(selectItemsQuery, [invoiceId]);

    // Construct the invoice data with items
    const invoiceData = {
      ...invoiceDetails,
      items: itemRows,
    };

    // Return the invoice data in the response
    res.status(200).json(invoiceData);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default GetInvoiceById;

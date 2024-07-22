const GetInvoices = async (db, req, res) => {
  try {
    // Extract search query from request parameters
    const { search } = req.query;

    // Base SQL query to select all invoices
    let selectAllInvoicesQuery = `
        SELECT * FROM invoices;
      `;

    // If search query is provided, add WHERE clause to filter invoices
    if (search) {
      selectAllInvoicesQuery = `
          SELECT * FROM invoices 
          WHERE case_id LIKE ? OR invoice_number LIKE ?;
        `;
    }

    // Execute the SQL query to fetch invoices
    const [invoiceRows] = await db.query(selectAllInvoicesQuery, [
      `%${search}%`,
      `%${search}%`,
    ]);

    // Query to fetch invoice items for each invoice
    const selectItemsQuery = `
        SELECT * FROM invoice_items WHERE invoice_id = ?;
      `;

    // Array to store all invoices with their items
    const invoicesData = [];

    // Iterate over each invoice to fetch its items
    for (const invoice of invoiceRows) {
      const [itemRows] = await db.query(selectItemsQuery, [invoice.invoice_id]);
      // Construct the invoice data with items and push it to the array
      invoicesData.push({
        ...invoice,
        items: itemRows,
      });
    }

    res.status(200).json(invoicesData);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default GetInvoices;

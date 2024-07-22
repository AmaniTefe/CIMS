const EditSA = async (db, req, res) => {
  try {
    // Extract parameters from request body
    const { invoiceId, totalAmount, overallStatus, caseId, Note } = req.body;
    console.log("Data received from frontend:", req.body);

    // Prepare an array to store the fields that are actually being updated
    const fieldsToUpdate = [];
    const valuesToUpdate = [];

    // Check if totalAmount is provided and different from the current value
    if (totalAmount !== undefined && totalAmount !== null) {
      fieldsToUpdate.push("total_amount");
      valuesToUpdate.push(totalAmount);
    }

    // Check if overallStatus is provided and different from the current value
    if (overallStatus !== undefined && overallStatus !== null) {
      fieldsToUpdate.push("paid_status");
      valuesToUpdate.push(overallStatus);
    }

    // Add other fields to update if needed

    // If there are fields to update, construct the query dynamically
    if (fieldsToUpdate.length > 0) {
      const updateFields = fieldsToUpdate
        .map((field) => `${field} = ?`)
        .join(", ");
      const updateInvoiceQuery = `
        UPDATE invoices
        SET ${updateFields}, note = ?
        WHERE invoice_id = ?;
      `;

      const invoiceValues = [...valuesToUpdate, Note, invoiceId];

      // Execute the query to update the invoice
      const [invoiceResult] = await db.query(updateInvoiceQuery, invoiceValues);
      console.log(invoiceResult);

      // Update other related tables if needed

      if (invoiceResult.changedRows > 0) {
        res.status(200).json({
          success: true,
          message: "Invoice updated successfully",
        });
      } else {
        res.status(404).json({ success: false, error: "Item not found" });
      }
    } else {
      // If no fields are provided to update, return success
      res.status(200).json({
        success: true,
        message: "No changes detected",
      });
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default EditSA;

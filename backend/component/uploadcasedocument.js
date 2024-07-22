const uploadDocument = async (db, req, res) => {
    try {
        const filePath = req.file.filename; // Get the path of the uploaded file
        console.log("Uploaded file path:", filePath); // Log the file path

        // Retrieve the case ID and file path from the request body
        const { caseId } = req.body;

        // Log the received data
        console.log("Received data from frontend:");
        console.log("Case ID:", caseId);
        console.log("File Path:", filePath);
        
        // Update the file_path column in the cases table
        const updateFilePathQuery = `UPDATE cases SET file_path = ? WHERE case_id = ?`;
        await db.query(updateFilePathQuery, [filePath, caseId ]);

        // Send a success response back to the client
        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.error("Error uploading file:", error);
        // Send an error response back to the client
        res.status(500).json({ error: "Failed to upload file" });
    }
};

export default uploadDocument;

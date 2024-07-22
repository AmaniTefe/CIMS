import bcrypt from "bcrypt";

const AddClient = async (db, req, res) => {
  try {
    console.log('AddClient API triggered by another frontend API');

    console.log('Client Data:', {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
    });

    // Log the entire request body
    console.log('Full Request Body:', req.body);

    const clientData = req.body;

    if (!clientData || typeof clientData !== 'object') {
      console.error('Invalid request body:', clientData);
      return res.status(400).json({ error: "Invalid request body. Please provide a valid JSON object." });
    }

    const {
      first_name,
      middle_name,
      last_name,
      gender,
      email,
      mobile_number,
      alternate_number,
      address,
      references,
    } = clientData;

    if (!first_name || !last_name || !gender || !email || !mobile_number) {
      console.error('Missing required fields:', clientData);
      return res.status(400).json({ error: "Missing required fields. Please provide all required information." });
    }

    // Hash the email for use as a unique identifier (consider alternatives based on needs)

    const [clientResults] = await db.query('INSERT INTO Clients SET ?', {
      first_name,
      middle_name,
      last_name,
      gender,
      email,
      mobile_number,
      alternate_number,
      address,
    });

    const clientId = clientResults.insertId;

    if (references && references.length > 0) {
      for (const reference of references) {
        if (reference && typeof reference === 'object') {
          console.log('Reference Data:', {
            referenceName: reference.reference_name,
            referenceMobile: reference.reference_mobile,
          });

          await db.query('INSERT INTO ClientReferences SET ?', {
            client_id: clientId,
            reference_name: reference.reference_name,
            reference_mobile: reference.reference_mobile,
          });
        }
      }
    }

    res.status(201).json({ message: "Client added successfully", clientId });

  } catch (error) {
    console.error('Error adding client:', error);

    if (error.details) {
      console.error('Validation Errors:', error.details);
      return res.status(400).json({ error: "Validation Error", details: error.details });
    }

    console.error('Error Details:', error.message, error.stack);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default AddClient;


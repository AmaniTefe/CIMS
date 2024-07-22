const AddAdvocator = async (db, req, res) => {
    try {
      console.log('AddAdvocator API triggered by another frontend API');
  
      console.log('Advocator Data:', {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
      });
  
      // Log the entire request body
      console.log('Full Request Body:', req.body);
  
      const advocatorData = req.body;
  
      if (!advocatorData || typeof advocatorData !== 'object') {
        console.error('Invalid request body:', advocatorData);
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
      } = advocatorData;
  
      if (!first_name || !last_name || !gender || !email || !mobile_number) {
        console.error('Missing required fields:', advocatorData);
        return res.status(400).json({ error: "Missing required fields. Please provide all required information." });
      }
  
      const [advocatorResults] = await db.query('INSERT INTO Advocators SET ?', {
        first_name,
        middle_name,
        last_name,
        gender,
        email,
        mobile_number,
        alternate_number,
        address,
      });
  
      const advocatorId = advocatorResults.insertId;
  
      res.status(201).json({ message: "Advocator added successfully", advocatorId });
  
    } catch (error) {
      console.error('Error adding advocator:', error);
  
      if (error.details) {
        console.error('Validation Errors:', error.details);
        return res.status(400).json({ error: "Validation Error", details: error.details });
      }
  
      console.error('Error Details:', error.message, error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export default AddAdvocator;
  
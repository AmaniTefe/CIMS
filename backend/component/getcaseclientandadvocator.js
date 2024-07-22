// Function to fetch clients
export const getCaseClients = async (db, req, res) => {
    try {
      const clients = await db.query("SELECT * FROM clients");
   // Log the clients
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Function to fetch advocates
  export const getCaseAdvocates = async (db, req, res) => {
    try {
      const advocates = await db.query("SELECT * FROM advocators");
       // Log the advocates
      res.json(advocates);
    } catch (error) {
      console.error("Error fetching advocates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const getCaseProsecutors = async (db, req, res) => {
    try {
      // Log the SQL query
   
      
      const prosecutors = await db.query("SELECT * FROM users WHERE role = 'Proscuter'");
      
      // Log the prosecutors result
     
      // Send the prosecutors data as JSON response
      res.json(prosecutors);
    } catch (error) {
      // Log any errors that occur during the process
      console.error("Error fetching prosecutors:", error);
      
      // Send an error response if an error occurs
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
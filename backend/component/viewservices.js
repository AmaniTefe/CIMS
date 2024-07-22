const ViewServices = async (req, res) => {
  try {
    const [results] = await global.pool.query(
      "SELECT id, name, amount FROM services"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching services: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default ViewServices;

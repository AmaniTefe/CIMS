const Getuser = async (req, res) => {
  try {
    const [results] = await global.pool.query(
      "SELECT id, first_name, last_name, email, phone_number, address, role, status ,image FROM users"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default Getuser;
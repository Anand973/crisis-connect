const validateRegistration = (req, res, next) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    
    // Array to collect error messages
    const errors = [];
    
    // Check required fields
    if (!firstName || !lastName || !email || !password) {
      errors.push('Please fill in all required fields');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
    
    // Check password strength (min 8 chars, at least one number and one letter)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
   
    // Check if passwords match
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    // If there are errors, return them
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // If validation passes, proceed
    next();
  };
  
  module.exports = { validateRegistration };
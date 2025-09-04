const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const axios = require('axios');

const problemRoutes = require('./routes/problemRoute');
const userRoutes = require('./routes/userRoute');
const submissionRoutes = require('./routes/submissionRoute');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// (2) Proxy route to Piston
app.post('/run-code', async (req, res) => {
  try {
    const { language, version, files, stdin } = req.body;

    const response = await axios.post(process.env.PISTON_API_URL || 'http://localhost:2000/api/v2/execute', {
      language,
      version,
      files,
      stdin
    });
    
    console.log(response.data);

    res.json(response.data);
  } catch (error) {
    console.error("Error calling Piston:", error);
    res.status(500).json({ error: 'Execution failed' });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: error.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
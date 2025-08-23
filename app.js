const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');

const problemRoutes = require('./routes/problemRoute');
const userRoutes = require('./routes/userRoute');
const submissionRoutes = require('./routes/submissionRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// (2) Proxy route to Piston
app.post('/run-code', async (req, res) => {
  try {
    const { language, version, files, stdin } = req.body;

    const response = await axios.post('http://localhost:2000/api/v2/execute', {
      language,
      version,
      files,
      stdin
    });
    
    console.log(response);

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

// DB Connection
mongoose.connect('mongodb://localhost:27017/ProblemDB')
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(5000, () =>
      console.log(`Server running on http://localhost:5000`)
    );
  })
  .catch(err => console.log(err));

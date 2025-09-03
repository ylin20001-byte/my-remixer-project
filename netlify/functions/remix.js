// --- 1. Import Dependencies ---
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const serverless = require('serverless-http'); // Netlify handler

// --- 2. Basic Express App Setup ---
const app = express();
const router = express.Router(); // Use an Express Router

// Use CORS to allow requests from the Netlify domain
app.use(cors());

// Multer configuration for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// --- 3. The API Endpoint Logic (moved to a router) ---
router.post('/', upload.single('audio_file'), async (req, res) => {
    console.log('Function invoked: Received a request on /remix');

    try {
        // --- Get Data from the Front-End ---
        const style = req.body.style;
        const youtubeUrl = req.body.youtube_url;
        const audioFile = req.file;
        const apiKey = req.headers.authorization?.split(' ')[1];

        if (!apiKey) {
            return res.status(401).json({ error: 'Authorization header with API Key is missing.' });
        }
        if (!audioFile && !youtubeUrl) {
            return res.status(400).json({ error: 'No audio file or YouTube URL provided.' });
        }

        console.log(`> Style: ${style}`);
        console.log(`> API Key Received: Yes`);
        if (audioFile) {
            console.log(`> Received File: ${audioFile.originalname}`);
        } else {
            console.log(`> Received YouTube URL: ${youtubeUrl}`);
        }

        // --- !!! THIS IS WHERE YOU CALL THE REAL AI SERVICE !!! ---
        console.log('Simulating AI processing...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Simulation complete.');
        
        if (!audioFile) {
             return res.status(400).send("Demo server cannot process YouTube URLs. Please upload an MP3 to test the full flow.");
        }

        const remixedAudioBuffer = audioFile.buffer;
        const fileName = `remix_${Date.now()}.mp3`;

        // --- Send the Result Back ---
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(remixedAudioBuffer);

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// --- 4. Wire up the router and export the handler ---
// This tells Netlify that all requests to /.netlify/functions/remix should be handled by our router
app.use('/.netlify/functions/remix', router);

// Export the handler for Netlify to use
module.exports.handler = serverless(app);

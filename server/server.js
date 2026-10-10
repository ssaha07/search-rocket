
const express = require("express");
const cors = require("cors");
const { performance } = require("perf_hooks");

const {
    getPresentation,
    extractTextFromPresentation
} = require("./googleSlides");

const PRESENTATION_ID =
    "1dCS3SEkbGgJtFV3933X0uX0gF6r1NDtPg5r7Qcqqzzc";

const app = express();

app.use(cors());
app.use(express.json());

// Backend health check
app.get("/", (req, res) => {
    res.send("Search Rocket backend is working!");
});

// Get a complete presentation
app.get("/api/slides/:id", async (req, res) => {
    try {
        const presentation =
            await getPresentation(req.params.id);

        res.json(presentation);
    } catch (error) {
        console.error("Slides API error:", error.message);

        res.status(500).json({
            error: "Unable to retrieve the presentation."
        });
    }
});

// Get presentation text
app.get("/api/slides/:id/text", async (req, res) => {
    try {
        const presentation =
            await getPresentation(req.params.id);

        const documents =
            extractTextFromPresentation(presentation);

        res.json({
            title: presentation.title,
            documents
        });
    } catch (error) {
        console.error("Slides text error:", error.message);

        res.status(500).json({
            error: "Unable to extract presentation text."
        });
    }
});

// Search the presentation
app.get("/api/search", async (req, res) => {
    try {
        const startTime = performance.now();

        const query = req.query.q;

        if (typeof query !== "string" || !query.trim()) {
            return res.json({
                results: [],
                searchTime: 0
            });
        }

        const searchTerm = query.trim().toLowerCase();

        const presentation =
            await getPresentation(PRESENTATION_ID);

        const documents =
            extractTextFromPresentation(presentation);

        const results = documents.filter((document) => {
            return (
                document.title.toLowerCase().includes(searchTerm) ||
                document.text.toLowerCase().includes(searchTerm)
            );
        });

        const searchTime =
            performance.now() - startTime;

        res.json({
            results,
            searchTime
        });
    } catch (error) {
        console.error("Search error:", error.message);

        res.status(500).json({
            error: "Search failed. Please try again later."
        });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

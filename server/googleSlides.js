
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

// Render Secret File path
const CREDENTIALS_PATH =
    process.env.GOOGLE_SERVICE_ACCOUNT_FILE ||
    path.join("/etc/secrets", "service-account.json");

// Read-only access to Google Slides
const SCOPES = [
    "https://www.googleapis.com/auth/presentations.readonly"
];

let authClient = null;

// Authenticate using the service account
async function getAuthClient() {
    if (authClient) {
        return authClient;
    }

    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error(
            `Service account credentials not found at ${CREDENTIALS_PATH}`
        );
    }

    const credentials = JSON.parse(
        fs.readFileSync(CREDENTIALS_PATH, "utf8")
    );

    authClient = new google.auth.GoogleAuth({
        credentials,
        scopes: SCOPES
    });

    return authClient;
}

// Create authenticated Slides client
async function getSlidesClient() {
    const auth = await getAuthClient();

    return google.slides({
        version: "v1",
        auth
    });
}

// Read a presentation
async function getPresentation(presentationId) {
    const slides = await getSlidesClient();

    const response = await slides.presentations.get({
        presentationId
    });

    return response.data;
}

// Extract text from slides
function extractTextFromPresentation(presentation) {
    const documents = [];

    for (
        let i = 0;
        i < (presentation.slides || []).length;
        i++
    ) {
        const slide = presentation.slides[i];
        let text = "";

        for (const element of slide.pageElements || []) {
            if (
                element.shape &&
                element.shape.text &&
                element.shape.text.textElements
            ) {
                for (
                    const textElement of element.shape.text.textElements
                ) {
                    if (textElement.textRun) {
                        text += textElement.textRun.content;
                    }
                }
            }
        }

        documents.push({
            id: slide.objectId,
            title: `Slide ${i + 1}`,
            text: text.trim(),
            url: `https://docs.google.com/presentation/d/${presentation.presentationId}/edit#slide=id.${slide.objectId}`
        });
    }

    return documents;
}

module.exports = {
    getPresentation,
    extractTextFromPresentation
};

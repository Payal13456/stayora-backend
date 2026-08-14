const express = require("express");
const openaiservice = require("../services/openaiService");
const propertySearchService = require("../services/propertySearchService");

const router = express.Router();

router.post(
  "/property-search",
  async (req, res) => {
   try {
    const { message } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a search message.",
      });
    }

    const cleanMessage = message.trim();

    if (cleanMessage.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid search.",
      });
    }

    // ==========================================
    // STEP 1
    // AI → FILTERS
    // ==========================================

    const filters =
      await openaiservice.extractPropertyFilters(cleanMessage);

    console.log(
      "Extracted AI Filters:",
      JSON.stringify(filters, null, 2)
    );

    // ==========================================
    // STEP 2
    // FILTERS → MONGODB
    // ==========================================

    const properties =
      await propertySearchService.searchProperties(filters);

    console.log(
      `AI Search found ${properties.length} properties`
    );

    // ==========================================
    // STEP 3
    // MONGODB RESULTS → AI
    // ==========================================

    const aiMessage =
      await openaiservice.generatePropertyResponse({
        userMessage: cleanMessage,
        filters,
        properties,
      });

    // ==========================================
    // STEP 4
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message: aiMessage,

      filters,

      count: properties.length,

      properties,
    });

  } catch (error) {
    console.error(
      "AI property search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process your property search right now.",
    });
  }
}
);

module.exports = router;
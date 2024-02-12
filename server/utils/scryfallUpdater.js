const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PythonShell } = require("python-shell");
const cron = require("node-cron");
const scriptPath = path.join(__dirname, "dbFiller.py");

cron.schedule(
  "*/0 3 * * *",
  async () => {
    console.log("Scryfall update process started.");
    try {
      // Fetch the latest bulk data metadata from Scryfall
      const response = await axios.get("https://api.scryfall.com/bulk-data");
      const allCardsBulkData = response.data.data.find((item) => item.type === "all_cards");
      const bulkDataUrl = allCardsBulkData.download_uri;

      // Download the bulk data file
      const bulkDataResponse = await axios.get(bulkDataUrl, { responseType: "arraybuffer" });

      const tempFilePath = path.join(__dirname, "tempBulkData.json"); // Adjusted for direct JSON

      // Write the response data to a file
      fs.writeFileSync(tempFilePath, bulkDataResponse.data);

      let options = {
        pythonPath: "C:\\Python312\\python.exe", // Path to the Python executable
        args: [tempFilePath],
      };

      PythonShell.run(scriptPath, options, function (err) {
        if (err) throw err;
        console.log("dbFiller.py finished.");
        // Clean up
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error("Error deleting the bulk data file:", err);
          } else {
            console.log("Bulk data file deleted successfully.");
          }
        });
      });

      console.log("Scryfall update process completed successfully.");
    } catch (error) {
      console.error("Error updating MTG card data:", error);
    }
},{
    scheduled: true,
    timezone: "America/Chicago",
  }
);

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { PythonShell } = require("python-shell");
const cron = require("node-cron");

cron.schedule("*/1 * * * *", async () => {
  console.log("Scryfall update process started.");
  try {
    // Fetch the latest bulk data metadata from Scryfall
    const response = await axios.get("https://api.scryfall.com/bulk-data");
    const allCardsBulkData = response.data.data.find((item) => item.type === "all_cards");
    const bulkDataUrl = allCardsBulkData.download_uri;

    // Download the bulk data file
    const bulkDataResponse = await axios.get(bulkDataUrl, { responseType: "arraybuffer" });
        console.log("Downloaded file size:", bulkDataResponse.data.length);
    const tempFilePath = path.join(__dirname, "tempBulkData.json.gz");
    fs.writeFileSync(tempFilePath, bulkDataResponse.data);

    // Decompress the gzip file
    zlib.unzip(fs.readFileSync(tempFilePath), (err, buffer) => {
      if (err) {
        console.error("An error occurred during decompression:", err);
        return;
      }

      fs.writeFileSync(tempFilePath.replace(".gz", ""), buffer);

      // Run the Python script to update the database
      PythonShell.run("dbFiller.py", null, function (err) {
        if (err) throw err;
        console.log("dbFiller.py finished.");

        // Clean up
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(tempFilePath.replace(".gz", ""));
      });
      console.log("Scryfall update process completed successfully.");
    });
  } catch (error) {
    console.error("Error updating MTG card data:", error);
  }
});

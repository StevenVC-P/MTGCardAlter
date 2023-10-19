const { Patreon } = require("../models");

async function updateDatabaseWithPatreonInfo(patreonRecordId, pledgeAmountCents) {
  const imagesPerDollar = 20;
  const additionalImages = Math.floor(pledgeAmountCents / 100) * imagesPerDollar;

  // Fetch the Patreon record using the patreonRecordId
  const patreonAccount = await Patreon.findByPk(patreonRecordId);

  if (!patreonAccount) {
    throw new Error(`Patreon account with record ID ${patreonRecordId} not found`);
  }

  // Calculate the new remaining_images value
  const newRemainingImages = patreonAccount.remaining_images + additionalImages;

  // Update the patreonAccount's remaining_images in the database
  await patreonAccount.update({ remaining_images: newRemainingImages });
}

module.exports = {
  updateDatabaseWithPatreonInfo,
};

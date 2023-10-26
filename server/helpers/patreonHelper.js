const { Patreon, User, TokenTransaction } = require("../models");

async function updateDatabaseWithPatreonInfo(patreonRecordId, pledgeAmountCents) {
  const tokensPerDollar = 50;
  const additionalTokens = Math.floor(pledgeAmountCents / 100) * tokensPerDollar;

  // Fetch the Patreon record using the patreonRecordId
  const patreonAccount = await Patreon.findByPk(patreonRecordId);

  if (!patreonAccount) {
    throw new Error(`Patreon account with record ID ${patreonRecordId} not found`);
  }

  // Find associated User record
  const userRecord = await User.findOne({ where: { patreon_account_id: patreonAccount.id } });

  if (!userRecord) {
    throw new Error(`User record with patreon_account_id ${patreonAccount.id} not found`);
  }

  // Update the user's token count (which are essentially images)
  const updatedTokens = userRecord.tokens + additionalTokens;
  await User.update({ tokens: updatedTokens }, { where: { id: userRecord.id } });

  // Create a new TokenTransaction record
  await TokenTransaction.create({
    userId: userRecord.id,
    amount: additionalTokens,
    type: "donation", // Assuming this is a new donation
    source: "Patreon",
  });

  // Update Patreon account's remaining tokens
  const newRemainingTokens = patreonAccount.remaining_tokens + additionalTokens;
  await patreonAccount.update({ remaining_tokens: newRemainingTokens });
}

module.exports = {
  updateDatabaseWithPatreonInfo,
};


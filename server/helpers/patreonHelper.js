const { Patreon, User, TokenTransaction, UserPatreonLink } = require("../models");

async function updateDatabaseWithPatreonInfo(patreonRecordId, pledgeAmountCents) {
  const tokensPerDollar = 50;
  const additionalTokens = Math.floor(pledgeAmountCents / 100) * tokensPerDollar;
  console.log("additionalTokens ", additionalTokens);
  // Fetch the Patreon record using the patreonRecordId
  const patreonAccount = await Patreon.findByPk(patreonRecordId);

  if (!patreonAccount) {
    throw new Error(`Patreon account with record ID ${patreonRecordId} not found`);
  }

  const userPatreonLink = await UserPatreonLink.findOne({ where: { patreon_account_id: patreonRecordId } });
  if (userPatreonLink) {
    console.log("Hi1")
    const userRecord = await User.findByPk(userPatreonLink.user_id);
    if (userRecord) {
      // Update the user's token count
      const updatedTokens = userRecord.tokens + additionalTokens;
      await User.update({ tokens: updatedTokens }, { where: { id: userRecord.id } });

      // Create a new TokenTransaction record
      await TokenTransaction.create({
        userId: userRecord.id,
        amount: additionalTokens,
        type: "donation", // Assuming this is a new donation
        source: "Patreon",
      });
    }
  } else {
    console.log("Hi2", patreonAccount.deferred_tokens);
    // If there's no linked user, update deferred tokens in the Patreon account
    const newDeferredTokens = patreonAccount.deferred_tokens + additionalTokens;
    await patreonAccount.update({ deferred_tokens: newDeferredTokens });
  }
}

module.exports = {
  updateDatabaseWithPatreonInfo,
};


const PageVisit = require('../models/pageVisit');

const visitCounter = async (req, res, next) => {
  const page = req.path;
  try {
    const [pageVisit, created] = await PageVisit.findOrCreate({
      where: { page },
      defaults: { visits: 1 }
    });
    if (!created) {
      pageVisit.visits += 1;
      pageVisit.last_visit = new Date();
      await pageVisit.save();
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = visitCounter;
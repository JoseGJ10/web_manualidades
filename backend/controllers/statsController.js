
const  PageVisit = require('../models/pageVisit');

exports.statsVisit = async (req, res) => {
    try {
      const stats = await PageVisit.findAll();
      res.status(200).json({data: stats, message: "Get stats data ok",error: ""});
    } catch (error) {
      res.status(500).json({data:{}, message:"", error: error.message });
    }
}
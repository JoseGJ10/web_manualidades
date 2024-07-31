const Craft = require('../models/user');

exports.getAllCrafts = async (req, res) => {

    try {
      const crafts = await Craft.findAll();
      
      res.status(200).json({data: crafts, message: "", error: ""});
    } catch (error) {

      console.error(error.message);
      res.status(500).json({data: {}, message: "", error: "Error en el servidor."});

    }
};

exports.createCraft = async (req, res) => {
    const { title, description } = req.body;
    
    try {
        const craft = await crafts.create({title, description});
    } catch (error) {
      
    }

};

exports.updateCraft = (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const crafUpdate = craft.update({title, description},{where: {id: id}});
      res.status(200).json({data: crafUpdate, message: "Craft update successfully", error: ""});
    } catch (error) {
      console.error(error.message);
      res.status(500).json({data: {}, message: "", error: "Updating Craft Error."});
    }

};

exports.deleteCraft = async (req, res) => {
    const { id } = req.params;
    try {
      
      await Craft.destroy(id);

      res.status(204).json({ data:{},message: 'Deleting Craft successfully' , error: ""});

    } catch (error) {
      console.error(error.message);
      res.status(500).json({data: {}, message: "", error: "Deleting Craft Error."});
    }
};


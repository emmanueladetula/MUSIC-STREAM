const { Artist } = require("../Model/mongooseSchema");
const { IdValidator } = require("../Validators/joiValidator");
const { StatusCodes } = require("http-status-codes");
const errorHandler = require("../handleErrors/handleError");
const fs = require("fs");

const deleteArtist = async (req, res) => {
  const { error, value } = IdValidator(req.params);
  if (error) {
    const errors = errorHandler.JoiErrorHandler(error);
    res.status(StatusCodes.BAD_REQUEST).json({ Error: errors });
  } 
  
  else {
    try {
      const deleteArtist = await Artist.findByIdAndDelete({ _id: value.id });

      if (deleteArtist) {
        fs.unlinkSync(deleteArtist.imageURL);
        res.status(StatusCodes.OK).json({ "Artist deleted": deleteArtist });
      } else
        res
          .status(StatusCodes.BAD_REQUEST)
          .send("Artist doesn't exist or already deleted");
    } catch (error) {
        if(error.kind =="ObjectId")
        res.status(StatusCodes.FORBIDDEN).json({message: "ID is incorrect."});
        else
        res.status(StatusCodes.FORBIDDEN).json({message: error.message});

    }
  }
};
module.exports = deleteArtist;

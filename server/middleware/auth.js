module.exports = function (req, res, next) {
  // Mock authentication - auto bypass
  req.user = { id: "650c90c9b0101b0000000001" };
  next();
};

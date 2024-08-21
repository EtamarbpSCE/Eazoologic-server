const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role === requiredRole) {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    };
  };
  
  module.exports = roleMiddleware;
  
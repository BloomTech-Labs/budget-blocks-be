const Budget = require('./budgetModel');

const validateBudgetId = (req, res, next) => {
  const { id } = req.params;
  Budget.findById(id)
    .then((budget) => {
      if (!budget) {
        res
          .status(404)
          .json({ message: 'Budget with given ID does not exist' });
      } else {
        req.budget = budget;
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'server error', error: err.message });
    });
};

module.exports = validateBudgetId;

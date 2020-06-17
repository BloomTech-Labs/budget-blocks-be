const express = require('express');

const Budget = require('./budgetModel.js');
const validateBudgetId = require('./validateBudgetId');
const requireAuthentication = require('../../okta/middleware/require_authentication');

const router = express.Router();

router.get('/goals', requireAuthentication, (req, res) => {
  Budget.findAll()
    .then((budgets) => {
      if (budgets.length !== 0) {
        res.json(budgets);
      } else {
        res.status(404).json({ message: 'There are no budget goals' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'server error', error: err.message });
    });
});

router.get(
  '/goals/:id',
  requireAuthentication,
  validateBudgetId,
  (req, res) => {
    const { budget } = req;
    res.json(budget);
  }
);

router.post('/goals', requireAuthentication, (req, res) => {
  const { body } = req;
  if (!body.user_id) {
    return res.status(400).json({ message: 'Must send user_id property' });
  }
  Budget.add(body)
    .then((budget) => {
      if (budget) {
        res.json(budget);
      } else {
        res
          .status(400)
          .json({ message: 'There was an error adding the budget goal' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'server error', error: err.message });
    });
});

router.put(
  '/goals/:id',
  requireAuthentication,
  validateBudgetId,
  (req, res) => {
    const { id } = req.params;
    const { body } = req;

    Budget.update(body, id)
      .then((count) => {
        res.json(count[0]);
      })
      .catch((err) => {
        res.status(500).json({ message: 'server error', error: err.message });
      });
  }
);

module.exports = router;

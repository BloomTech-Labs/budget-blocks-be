const express = require('express');

const Budget = require('./budgetModel.js');
const validateBudgetId = require('./validateBudgetId');
const requireAuthentication = require('../../okta/middleware/require_authentication');

const router = express.Router();

router.get('/goals', (req, res) => {
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

router.get('/goals/:user_id', (req, res) => {
  const { user_id } = req.params;

  Budget.findById(user_id)
  .then(budget => {
      if(budget.id >= 0){
          return res.status(200).json(budget)
      } else {
          return res.status(404).json({ message: 'Error id invalid' })
      }
  })
  .catch(() => {
      res.status(500).json({ message: 'Error Retrieving Item' })
  })
})

router.post('/goals', (req, res) => {
  const { body } = req;
  if (!body.user_id) {
    return res.status(400).json({ message: 'Must send user_id property' });
  }
  Budget.add(body)
    .then((budget) => {
        res.status(200).json(budget);
    })
    .catch((err) => {
      res.status(500).json({ message: 'server error', error: err.message });
    });
});

router.put(
  '/goals/:user_id',
  (req, res) => {
    const { user_id } = req.params;
    const { body } = req;

    Budget.update(body, user_id)
      .then((count) => {
        res.json(count[0]);
      })
      .catch((err) => {
        res.status(500).json({ message: 'server error', error: err.message });
      });
  }
);

module.exports = router;

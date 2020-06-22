require("dotenv").config();
const express = require("express");
const moment = require('moment')
const plaid = require("plaid");
const db = require("./plaidModel.js");
const datab = require("../data/db-config.js");
const router = express.Router();

var client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
  { version: "2019-05-29", clientApp: "Budget Blocks" }
);

// Checks if an access token exists for the user
function publicTokenExists(req, res, next) {
  // Check if the body contains any information
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "No information was passed into the body." });
  } else {
    // check specifically for the public token
    if (!req.body.publicToken) {
      res.status(400).json({ error: "You have not sync'd your bank account." });
      // If no errors, allow the middleware to go to the next endpoint
    } else {
      // res.status(200).json({message: req.body.publicToken});
      next();
    }
  }
}



// SECTION POST
// Add Access Token to Database
router.post("/token_exchange/:id", publicTokenExists, (req, res) => {
  const { publicToken } = req.body;
  try {
    client.exchangePublicToken(publicToken, function (error, tokenResponse) {
      if (error != null) {
        res.status(500).json({ message: "Error Exchanging Token", error });
      }
      // console.log(error);

      const ACCESS_TOKEN = tokenResponse.access_token;
      const { id } = req.params;

      db.findToken(ACCESS_TOKEN)
        .then((token) => {
          if (token.length !== 0) {
            res.status(404).json({ message: "Bank account already exists." });
          } else {
            db.plaid_access(ACCESS_TOKEN, id)
              .then((key) => {
                if (key) {
                  res.status(200).json({
                    message: "Bank account successfully stored.",
                  });
                } else {
                  res
                    .status(404)
                    .json({ message: "You are missing the user id" });
                }
              })
              .catch((error) => {
                res.status(500).json({ error: error.message });
              });
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//SECTION GET
//First gets user`s transactions based on
//passed id and then sends them back as a response
router.get("/userTransactions/:userId", (req, res) => {
  const user_id = req.params.userId;
  let startDate = moment()
    .subtract(30, "days")
    .format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");

  try {
    db.findTokensByUserId(user_id)
      .then(accessToken => {
        client.getTransactions(
          accessToken[0].access_token,
          startDate,
          endDate,
          {
            count: 250,
            offset: 0,
          }, function (error, transactionsResponse) {
            if (error != null) {
              return res.status(500).json({
                error: error
              });
            } else {
              res.status(200).json({ transactions: transactionsResponse.transactions, user_id: user_id })
            }
          }
        )
      }
      ).catch(err => {
        console.log(err.message);
      })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/userBalance/:userId", (req, res) => {
  const user_id = req.params.userId;

  try {
    db.findTokensByUserId(user_id)
      .then(accessToken => {
        client.getBalance(
          accessToken[0].access_token, 
          function (error, balanceResponse) {
            if (error != null) {
              return res.status(500).json({
                error: error
              });
            } else {
              res.status(200).json({ BalanceResponse: balanceResponse, user_id: user_id })
            }
          }
        )
      }
      )
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SECTION GET
// Find Access Token By userId
router.get("/accessToken/:userId", (req, res) => {
  const user_id = req.params.userId;
  try {
    db.findTokensByUserId(user_id)
      .then((accessToken) => {
        res.status(200).json({ data: accessToken });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SECTION GET
// Find All Access Tokens
router.get("/accessToken", (req, res) => {
  try {
    db.findAllTokens()
      .then((response) => {
        res.status(200).json({ data: response });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SECTION DELETE
// Delete a specific access tokens by user id
//--- delete a bank account ----- //
router.delete("/accessToken/:userId", (req, res) => {
  const user_id = req.params.userId;
  const bankId = req.body.bankId;

  try {
    db.deleteTokenByUserId(user_id, bankId)
      .then((user) => {
        if (user === 1) {
          res
            .status(200)
            .json({ message: "Bank account deleted successfully!" });
        } else {
          res.status(400).json({ message: "Bank account not found!" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete All Access Tokens by User Id
// --- delete all bank accounts feature --- //
// FIXME needs to make sure the user exists and that there are bank accounts
router.delete("/accessToken/:userId/all", (req, res) => {
  const user_id = req.params.userId;

  db.deleteAllTokensByUserId(user_id)
    .then((response) => {
      console.log(response);
      res
        .status(200)
        .json({ message: "All bank accounts successfully deleted!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;

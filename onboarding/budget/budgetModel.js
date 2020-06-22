const db = require('../../data/db-config.js');

module.exports = {
  findAll,
  findById,
  add,
  update,
  remove,
};

function findAll() {
  return db('budget_goals');
}

function findById(user_id) {
  return db('budget_goals').where({ user_id }).first();
}

function add(data) {
  return db('budget_goals')
    .insert(data, 'id')
    .then(([id]) => {
      return findById(id);
    });
}

function update(changes, user_id) {
  return db('budget_goals').update(changes).where({ user_id }).returning('*');
}

function remove(id) {
  return db('budget_goals').where({ id }).del();
}

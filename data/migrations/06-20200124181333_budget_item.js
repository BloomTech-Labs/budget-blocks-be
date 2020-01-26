
exports.up = function(knex) {
  return knex.schema.createTable('budget_item', tbl=>{

    tbl.increments();

    tbl.string('name', 255)
    .notNullable()

    tbl.decimal('amount')
    .notNullable()

    tbl.string('payment_date')
    

    tbl.integer('category_id')
    .unsigned()
    .references('id')
    .inTable('category')
    .notNullable()
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('budget_item')
};

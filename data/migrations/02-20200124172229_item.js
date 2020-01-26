
exports.up = function(knex) {
  
    return knex.schema.createTable('item', tbl=>{

        tbl.increments();

        tbl.string('item_id')

        //foreign key

        tbl.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('item')
};

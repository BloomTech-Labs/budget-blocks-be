
exports.up = function(knex) {
    return knex.schema.createTable('user_category', tbl=>{

        tbl.primary(['category_id','user_id' ])

        tbl.integer('category_id')
        .unsigned()
        .references('id')
        .inTable('category')
        .notNullable()
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

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
  return knex.schema.dropTableIfExists('user_category')
};

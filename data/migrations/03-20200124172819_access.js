
exports.up = function(knex) {
    return knex.schema.createTable('access', tbl=>{

        tbl.increments();

        tbl.string('access_token')

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
  return knex.schema.dropTableIfExists('access')
};

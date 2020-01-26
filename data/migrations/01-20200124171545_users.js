
exports.up = function(knex) {

    return knex.schema.createTable('users', tbl=>{

        tbl.increments();

        tbl.string('username', 128)
        .notNullable()
        .unique();

        tbl.string('password', 128)
        .notNullable();

        tbl.string('name',160)
        .notNullable();

        tbl.decimal('allowance')
        .notNullable();
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};

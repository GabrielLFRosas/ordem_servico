
exports.up = function(knex) {
    return knex.schema.createTable('serviceOrders', table => {
        table.increments('id').primary()
        table.integer('clientId').references('id')
                                .inTable('users').notNull()
        table.integer('contributorId').references('id')
                                      .inTable('contributors')
        table.integer('serviceId').references('id')
                                  .inTable('services')
        table.string('status').notNull()
        table.string('description', 1000).notNull()
        table.string('affectedDevice').notNull()
        table.string('problem', 1000).notNull()
        table.string('solution', 1000).notNull()
        table.string('report', 1000)
        table.timestamp('createdAt')
        table.timestamp('updatedAt')
        table.timestamp('closedAt')
        table.timestamp('deletedAt')
    })
};


exports.down = function(knex) {
  
};


exports.seed = function(knex) {
      // Inserts seed entries
      return knex('category').insert([
        {name: 'Bank Fees', default:true},
        {name: 'Cash Advance', default:true},
        {name: 'Community', default:true},
        {name: 'Education', default:true},
        {name: 'Law Enforcement', default:true},
        {name: 'Religious', default:true},
        {name: 'Food and Drink', default:true},
        {name: 'Healthcare', default:true},
        {name: 'Interest', default:true},
        {name: 'Payment', default:true},
        {name: 'Recreation', default:true},
        {name: 'Service', default:true},
        {name:"Automotive", default:true},
        {name:"Cable", default:true},
        {name:"Construction", default:true},
        {name:"Financial", default:true},
        {name:"Home Improvement", default:true},
        {name:"Internet Services", default:true},
        {name:"Utilities", default:true},
        {name:"Shops", default:true},
        {name:"Tax", default:true},
        {name:"Transfer", default:true},
        {name:"Travel", default:true},
        {name:"Real Estate", default:true}
      ]);
};

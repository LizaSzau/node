'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', [{
            name: 'Liza Szauder',
            email: 'liza.szauder@gmail.com',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            name: 'Pink Coca',
            email: 'pink.coca@gmail.com',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    async down (queryInterface, Sequelize) {}
};

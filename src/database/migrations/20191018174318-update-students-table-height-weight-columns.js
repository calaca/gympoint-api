module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('students', 'height', {
        type: Sequelize.INTEGER(),
        allowNull: false,
      }),
      await queryInterface.changeColumn('students', 'weight', {
        type: Sequelize.INTEGER(),
        allowNull: false,
      }),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('students', 'height', {
        type: Sequelize.FLOAT(),
        allowNull: false,
      }),
      await queryInterface.changeColumn('students', 'weight', {
        type: Sequelize.FLOAT(),
        allowNull: false,
      }),
    ];
  },
};

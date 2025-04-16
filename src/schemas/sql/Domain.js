'use strict';
const {
  Model,
  DataTypes,
} = require('sequelize');

module.exports = (sequelize) => {
  class Domain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * This method is called after defining all app models
     */
    static associate(models) {
      // define association here
      Domain.belongsTo(models.Tenant, {
        foreignKey: {
          name: 'tenant_id',
          type: DataTypes.UUID,
        },
      });
    }
  }

  Domain.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Tenant',
        key: 'id',
      },
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Domain',
    tableName: 'domains',
    timestamps: false,
  });

  return Domain;
};

'use strict';

const {
  DataTypes,
  Model,
} = require('sequelize');

module.exports = (sequelize) => {

  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * This method is called after defining all app models
     */
    static associate(models) {
      // define association here
      Tenant.hasMany(models.Domain, {
        foreignKey: 'tenant_id',
      });
    }
  }

  Tenant.init({
    id: {
      type: DataTypes.UUID,
      // autoIncrementIdentity: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    shared: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    db_connection: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    db_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    db_options: {
      type: DataTypes.JSON,
      defaultValue: {},
    }
  }, {
    sequelize,
    modelName: 'Tenant',
    tableName: 'tenants',
    timestamps: false,
  });

  return Tenant;
};

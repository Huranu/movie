module.exports = function (sequelize, DataTypes) {
  const movie = sequelize.define("movie", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    extract: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: DataTypes.INTEGER,
    cast: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    imdb: {
      type: DataTypes.INTEGER,
    },
  });
  return movie;
};

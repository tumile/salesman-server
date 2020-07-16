/* eslint-disable max-classes-per-file */

class CustomError extends Error {}

class PlayerExistsError extends CustomError {}

class PlayerNotFoundError extends CustomError {}

module.exports = {
  CustomError,
  PlayerExistsError,
  PlayerNotFoundError,
};

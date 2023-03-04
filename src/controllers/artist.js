const db = require('../db/index')

const artistController = async (req, res) => {
  try {
    const { name, genre } = req.body
    // console.log(name, genre);
    const { rows: [artist] } = await db.query(
      "INSERT INTO Artists(name, genre) VALUES($1, $2) RETURNING *",
      [name, genre]
    )
    res.status(201).send(artist);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const readArtist = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM Artists;"
    )
    res.status(200).send(rows)
  } catch (error) {
    res.status(500).send(error);
  }

}

const findArtist = async (req, res) => {
  try {
    const artistID = await req.params.id
    const { rows } = await db.query(
      `SELECT * FROM Artists WHERE id=${artistID}`
    )
    res.status(200).send(rows[0])
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { artistController, readArtist, findArtist }

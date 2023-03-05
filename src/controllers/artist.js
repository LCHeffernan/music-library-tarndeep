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
    if (!rows[0]) {
      return res.status(404).send({ message: `artist ${artistID} does not exist` })
    }
    res.status(200).send(rows[0])
  } catch (error) {
    res.status(500).send(error);
  }
}

const updateArtist = async (req, res) => {
  try {
    const artistID = await req.params.id;
    const { name, genre } = req.body
    const { rows } = await db.query(
      `UPDATE Artists SET name=$1, genre=$2 WHERE id=$3 RETURNING *;`,
      [name, genre, artistID]
    )
    if (!rows[0]) {
      return res.status(404).send({ message: `artist ${artistID} does not exist` })
    }
    res.status(200).send(rows[0])
  } catch (error) {
    res.status(500).send(error);
  }
}

const patchArtist = async (req, res) => {
  try {
    const artistID = await req.params.id;
    const { name, genre } = req.body
    if (!name && genre) {
      const { rows } = await db.query(
        `UPDATE Artists SET genre=$1 WHERE id=$2 RETURNING *`, [genre, artistID]
      )
      res.status(200).send(rows[0])
    } else if (!genre && name) {
      const { rows } = await db.query(
        `UPDATE Artists SET name=$1 WHERE id=$2 RETURNING *`, [name, artistID]
      )
      res.status(200).send(rows[0])
    } else if (!name && !genre) {
      res.status(400).send({ message: `Syntax Error: artist: ${artistID}, name: ${name}, genre: ${genre} ` })
    }
    const { rows } = await db.query(
      `UPDATE Artists SET name=$1, genre=$2 WHERE id=$3 RETURNING *;`,
      [name, genre, artistID]
    )
    if (!rows[0]) {
      return res.status(404).send({ message: `artist ${artistID} does not exist` })
    }
    res.status(200).send(rows[0])

  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = { artistController, readArtist, findArtist, updateArtist, patchArtist }

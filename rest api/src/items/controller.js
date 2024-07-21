//control logic of each route:
const db = require("../../db");
const queries = require("./queries");
//1.CREATE (/items):
const addItem = (req, res) => {
  console.log("CREATE - adding new item to table...");
  const topic = req.body.topic;
  const duration = req.body.duration;
  const link = req.body.link;
  console.log(topic, duration, link);
  db.query(queries.addItem, [topic, duration, link], (error, result) => {
    if (error) {
      throw error;
    } else {
      //res.status(201).send("item added successfully!");
      const newItem = {
        id: result.insertId, // Assuming your query returns the new item's ID
        topic: topic,
        duration: duration,
        link: link,
      };
      res.status(201).json(newItem); //send the added row back
    }
  });
};
//2.a.READ(/items):
const getItems = (req, res) => {
  const filter = req.query.filter; //either filter is hide or show or "".
  if (filter) {
    if (filter === "show") {
      db.query(queries.getShowItems, (error, result) => {
        if (error) throw error;
        else {
          // if (result.rowCount) {
          //   res.status(200).send(result.rows);
          // } else {
          //   res.status(200).send("No items to show");
          // }
          res.status(200).send(result.rows);
        }
      });
    } else if (filter === "hide") {
      db.query(queries.getHideItems, (error, result) => {
        if (error) throw error;
        else {
          res.status(200).send(result.rows);
          // if (result.rowCount) {
          //   res.status(200).send(result.rows);
          // } else {
          //   res.status(200).send(result.rows);
          // }
        }
      });
    } else {
      res.status(404).send("ERROR 404; Page Not Found");
    }
  } else {
    //by default show unhidden items

    console.log("READ - getting all items...");
    db.query(queries.getAllItems, (error, result) => {
      if (error) throw error;
      else {
        // if (result.rowCount) {
        //   res.status(200).send(result.rows);
        // } else {
        //   res.status(200).send("No items in database");
        // }
        res.status(200).send(result.rows);
      }
    });
  }
};
//2.b.READ(/items/:id)
const getItemById = (req, res) => {
  console.log("READ - getting item by ID...");
  const id = parseInt(req.params.id);

  db.query(queries.getItemById, [id], (error, result) => {
    if (error) throw error;
    else {
      console.log("row count for id: ", result.rowCount);
      if (result.rowCount) {
        res.status(200).send(result.rows);
      } else {
        res.status(404).send("Requested Item Not Found");
      }
    }
  });
};
//3.UPDATE (items/:id)
const updateItem = (req, res) => {
  const id = parseInt(req.params.id);
  db.query(queries.getItemById, [id], (err, result) => {
    if (err) throw err;
    else {
      if (result.rowCount) {
        const topic = req.body.topic;
        const duration = req.body.duration;
        const link = req.body.link;
        db.query(
          queries.updateItem,
          [id, topic, duration, link],
          (error, response) => {
            if (error) throw error;
            else {
              // console.log("updated row:", response.rows);
              // res.status(200).send("Updated Item Succesfully!");
              db.query(queries.getItemById, [id], (err, updatedResult) => {
                if (err) throw err;
                else {
                  const updatedItem = updatedResult.rows[0];
                  res.status(200).json(updatedItem);
                }
              });
            }
          }
        );
      } else {
        res.status(404).send("Requested Item Not Found");
      }
    }
  });
};
//4.DELETE (items/:id)
const deleteItem = (req, res) => {
  const id = parseInt(req.params.id);
  db.query(queries.getItemById, [id], (err, result) => {
    if (err) throw err;
    else {
      if (result.rowCount) {
        const deletedItem = result.rows[0];
        db.query(queries.deleteItem, [id], (error, response) => {
          if (error) throw error;
          else {
            // res.send("Deleted Item Succesfully!");
            res.send(deletedItem);
          }
        });
      } else {
        res.status(404).send("Requested Item Not Found");
      }
    }
  });
};
//PATCH (items/:id)
const patchItem = (req, res) => {
  const id = parseInt(req.params.id);
  db.query(queries.getItemById, [id], (error, result) => {
    if (error) {
      console.error("Error fetching item by ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.rowCount) {
      const statusToUpdate = req.body.status.toLowerCase(); // show/hide
      const previousStatus = result.rows[0].hidden;
      const newStatus = statusToUpdate === "show" ? false : true;

      // Check if there is any change in status
      if (previousStatus !== newStatus) {
        db.query(queries.updateStatus, [newStatus, id], (errr, ress) => {
          if (errr) {
            console.error("Error updating status:", errr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (ress.rowCount) {
            res.status(200).json(ress.rows[0]);
          } else {
            res.status(400).json({ error: "Update failed" });
          }
        });
      } else {
        res.status(200).json({ message: "No status change needed" });
      }
    } else {
      res.status(404).json({ error: "Requested Item Not Found" });
    }
  });
};

module.exports = {
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  patchItem,
};

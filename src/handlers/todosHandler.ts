/* todosHandler.ts berfungsi untuk menangani request yang masuk ke server. */
import db from "../utils/database";
import type { Response, Request } from "express";
import moment from "moment";


declare module "express-session" {
  interface Session {
    message?: string;
    userId?: number;
    username?: string;
  }
}


// Fungsi untuk display homepage dan todolist
export const displayAllTodos = async (req: Request, res: Response) => {
  try {
    // Periksa apakah sesi ada
    if (!req.session.userId || !req.session.username) {
      return res.redirect('/login'); // Hentikan eksekusi jika pengguna tidak login
    }

    console.log("Logged in user:", req.session.userId, req.session.username);

    // Periksa status koneksi database
    if (db.state === 'disconnected') {
      db.connect();
    }

    const query = `
      SELECT 
        id,
        deadline,
        GROUP_CONCAT(task SEPARATOR ', ') AS tasks,
        GROUP_CONCAT(description SEPARATOR ', ') AS descriptions,
        GROUP_CONCAT(status SEPARATOR ', ') AS statuses
      FROM 
        todos
      WHERE user_id = ?
      GROUP BY 
        deadline
      ORDER BY 
        deadline ASC;
    `;

    // Gunakan parameterized query untuk menghindari SQL injection
    db.query(query, [req.session.userId], (err, rows) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send("Internal Server Error");
      }

      const data = JSON.parse(JSON.stringify(rows));

      res.render('home/index', {
        title: "PlanX | Todolist App",
        data: data,
        moment: moment,
        username: req.session.username,
      });
    });
  } catch (error) {
    console.error("Error fetching grouped todos:", error);
    res.status(500).send("Internal Server Error");
  }
};



export const displayAddForm = async (req:Request, res:Response) => {
    res.render('home/tambah')
}

export const addTodo = async (req: Request, res: Response) => {
  try {
    if(db.state === 'disconnected') {
      db.connect();
    }
    const { judul, deskripsi, deadline } = req.body
    const query = `INSERT INTO todos 
    (
    user_id, 
    task, 
    description, 
    deadline, 
    status
    ) 
    VALUES 
    (
    "${req.session.userId}", 
    "${judul}", 
    "${deskripsi}", 
    "${deadline}", 
    "belum selesai"
    )`;
    db.query(query, (err, rows) => {
      if (err) { 
        req.session.message = "Gagal Menambahkan todo";
        throw err;
      }
      req.session.message = "Todo berhasil ditambahkan"
      res.redirect('/')
    })
  } catch (error) {
    console.error(error);
    res.status(500).send('Cant add todo')
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
    try {
      if(db.state === 'disconnected') {
        db.connect();
      }
        const { id } = req.params;
        const query = `
            DELETE FROM todos where id = ${id}
        `;
        db.query(query, (err, rows) => {
            if (err) throw err;
            res.redirect('/')
        })
    } catch (error) {
        console.error("Cant find todo:", error);
        res.status(500).send("Internal Server Error");
    }
}

export const updateStatus = async (req: Request, res: Response) => {
    try {
      if(db.state === 'disconnected') {
        db.connect();
      }
        const { id } = req.params;
        const status = req.body.status
        const statusBaru = status === 'belum selesai' ? 'selesai' : 'belum selesai'
        const query = `
            UPDATE todos SET status = '${statusBaru}' where id = ${id}
        `;
        db.query(query, (err, rows) => {
            if (err) throw err;
            res.redirect('/')
        })
    } catch (error) {
        console.error("Cant find todo:", error);
        res.status(500).send("Internal Server Error");
    }
}

export const editTodo = async (req: Request, res: Response) => {
  try {
    if (db.state === 'disconnected') {
      db.connect();
    }
    const { id } = req.params;
    const query = `SELECT * FROM todos WHERE id = ${id}`;
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send("Internal Server Error");
      }
      const data = JSON.parse(JSON.stringify(rows));
      res.render('home/edit', {
        title: "PlanX | Edit Todos",
        id: data[0].id,
        task: data[0].task,
        description: data[0].description,
        deadline: new Date(data[0].deadline).toISOString().split("T")[0]
      });
    });
  } catch (error) {
    console.error("Cant find todo:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    if (db.state === 'disconnected') {
      db.connect();
    }
    const { id } = req.params
    const { judul, deskripsi, deadline } = req.body
    const query = `UPDATE todos SET task = '${judul}', description = '${deskripsi}', deadline = '${deadline}' WHERE id = ${id}`
    db.query(query, (err, rows) => {
      if (err) { 
        req.session.message = "Gagal Menambahkan todo";
        throw err;
      }
      req.session.message = "Todo berhasil diupdate"
      res.redirect('/')
    })
  } catch (error) {
    console.error(error);
    res.status(500).send('Cant add todo')
  }
}

/* end of todosHandler.ts */
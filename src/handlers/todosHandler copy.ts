import db from "../utils/database";
import type { Response, Request } from "express";
import type { Session } from "express-session";
import moment from "moment";
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

declare module "express-session" {
  interface Session {
    message?: string;
    userId?: number;
    username?: string;
  }
}


const queryAsync = promisify(db.query).bind(db);


// Fungsi untuk display homepage dan todolist
export const displayAllTodos = async (req: Request, res: Response) => {
  try {
    // Periksa apakah sesi ada
    if (!req.session.userId || !req.session.username) {
      return res.redirect('/login');
    }

    if (db.state === 'disconnected') {
      db.connect();
    }

    // Ambil kata kunci pencarian dari query parameter
    const keyword = req.query.q ? req.query.q.toString() : '';
    console.log(keyword)

    const baseQuery = `
      SELECT 
        id,
        deadline,
        GROUP_CONCAT(task SEPARATOR ', ') AS tasks,
        GROUP_CONCAT(description SEPARATOR ', ') AS descriptions,
        GROUP_CONCAT(status SEPARATOR ', ') AS statuses
      FROM 
        todos
      WHERE user_id = ?
    `;

    // Tambahkan kondisi pencarian jika ada keyword
    const searchCondition = keyword
      ? `AND (task LIKE ? OR description LIKE ?)`
      : '';

    const query = `
      ${baseQuery}
      ${searchCondition}
      GROUP BY deadline
      ORDER BY deadline ASC;
    `;

    const params = keyword
      ? [req.session.userId, `%${keyword}%`, `%${keyword}%`]
      : [req.session.userId];

    db.query(query, params, (err, rows) => {
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
        q: keyword, // Kirim kata kunci pencarian ke view
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
    const rows = await queryAsync(query);
    const data = JSON.parse(JSON.stringify(rows));
    
    res.render('home/edit', {
      title: "PlanX | Edit Todos",
      id: data[0].id,
      task: data[0].task,
      description: data[0].description,
      deadline: new Date(data[0].deadline).toISOString().split("T")[0]
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

export const getLogin = async (req: Request, res: Response) => {
  res.render('auth/login', {
    title: 'Login Page',
  });
}

export const getRegister = async (req: Request, res: Response) => {
  res.render('auth/register', {
    title: 'Register Page',
  });
}

export const postLogin = async (req: Request, res: Response) => {
  try {
    if (db.state === 'disconnected') {
      await db.connect(); // Pastikan ini async jika diperlukan
    }

    const { username, password } = req.body;
    console.log("Login attempt:", username, password);

    const query = `SELECT * FROM users WHERE username = ?`; // Hindari SQL injection
    db.query(query, [username], (err, rows) => {
      if (err) {
        console.error("Database query error:", err);
        req.session.message = "Login gagal, silahkan coba lagi";
        return res.redirect('/login');
      }

      if (rows.length === 0) {
        console.log("User not found");
        req.session.message = "Login gagal, silahkan coba lagi";
        return res.redirect('/login');
      }

      const user = rows[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          console.log("Password mismatch or error:", err);
          req.session.message = "Login gagal, silahkan coba lagi";
          return res.redirect('/login');
        }

        // Jika berhasil login
        req.session.userId = user.id;
        req.session.username = user.username;
        console.log("Session userId set:", req.session.userId);

        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).send("Internal Server Error");
          }
          console.log("Session saved successfully");
          res.redirect('/');
        });
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send('Internal Server Error');
  }
};


export const postRegister = async (req: Request, res: Response) => {
  try {
    const validateInput = (fullName: string, username: string, password: string) => {
      const errors: string[] = [];
    
      if (!fullName || fullName.trim().length === 0) {
        errors.push("Full name is required.");
      }
      
      if (!username || username.trim().length === 0) {
        errors.push("Username is required.");
      } else if (username.length < 3) {
        errors.push("Username must be at least 3 characters long.");
      }
    
      if (!password || password.trim().length === 0) {
        errors.push("Password is required.");
      } else if (password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
      }
    
      return errors;
    };
  
    if(db.state === 'disconnected') {
      db.connect();
    }
    const { fullName, username, password } = req.body;
    const errors = validateInput(fullName, username, password);
    if (errors.length > 0) {
      req.session.message = "Registrasi gagal silahkan ulangi"
      res.redirect('/register');
    }
    bcrypt.hash(password, 10, (err, hash) => {
      const query = `INSERT INTO users (fullname, username, password) VALUES ('${fullName}', '${username}', '${hash}')`
      db.query(query, (err, rows) => {
        if (err) {
          req.session.message = "Registrasi gagal silahkan ulangi"
          res.redirect('/register');
        }
        req.session.message = "Registrasi berhasil, silahkan login"
        res.redirect('/login');
      })
    })
  } catch (error) {
    console.error(error);
    res.status(500).send('Cant Register')
  }
}

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("Session destroyed successfully");
    res.redirect('/login');
  });
  res.redirect('/login');
}

export const guestOnly = (req: Request, res: Response, next: any) => {
  console.log("Session userId:", req.session.userId);
  if (req.session.userId) {
      // Jika user sudah login, redirect ke halaman utama atau dashboard
      return res.redirect('/');
  }
  next();
};

export const authOnly = (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
      // Jika user belum login, redirect ke halaman login
      return res.redirect('/login');
  } 
  next();
}
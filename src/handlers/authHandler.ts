/* authHandler.ts */
import db from "../utils/database";
import type { Response, Request } from "express";
import bcrypt from 'bcryptjs';

declare module "express-session" {
  interface Session {
    message?: string;
    userId?: number;
    username?: string;
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
  
  export const guestOnly = (req: Request, res: Response, next: Function) => {
    if (req.session.userId) {
        // Jika user sudah login, redirect ke halaman utama atau dashboard
        return res.redirect('/');
    }
    next();
  };
  
  export const authOnly = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
        // Jika user belum login, redirect ke halaman login
        return res.redirect('/login');
    } 
    next();
  }
  /* end of authHandler.ts */
const express = require('express');
const path = require('path');
const sequelize = require('../config/database');
const visitCounter = require('../middleware/stats');


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        // HTML ENGINE CONFIG
        // this.htmlEngine();

        // Config database
        this.connectDB();

        // Config middlewares
        this.middlewares();

        // Config routes
        this.routes();
    }

    async connectDB() {
        try {
            await sequelize.authenticate();
            console.log('Connection to the database established.');
        } catch (error) {
            console.error('Could not connect to the database:', error);
        }
    }
    
    htmlEngine() {

        // Init ejs
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, '../views'));

    }

    middlewares() {
        // Middleware para servir archivos estáticos
        this.app.use(express.json());
        this.app.use(visitCounter);
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
        this.app.use('/css', express.static(path.join(__dirname, '../public/css')));
        this.app.use('/js', express.static(path.join(__dirname, '../public/js')));
    }

    routes() {
        
        // Import routes
        const indexRouter = require('../routes/index');
        const craftsRouter = require('../routes/crafts'); 
        const userRouter = require('../routes/users');
        const statsRouter = require('../routes/stats');

        // Use routes

        this.app.use('/', indexRouter);
        this.app.use('/api/crafts', craftsRouter);
        this.app.use('/api/users', userRouter);
        this.app.use('/api/stats', statsRouter);

    }

    //Init Server
    listen() {
        sequelize.sync({alter: false}).then(()=> {
            this.app.listen(this.port, () => {
                console.log(`Server Run in http://localhost:${this.port}`);
            });
        })
    }
}

module.exports = Server;

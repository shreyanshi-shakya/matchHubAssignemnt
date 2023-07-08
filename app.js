const express = require('express');
const mongoose = require('mongoose');

class matchServer {
  constructor(port, databaseUrl) {
    this.port = port;
    this.databaseUrl = databaseUrl;
    this.app = express();
    this.server = null;
  }

  async setUp() {
    await this.connectDatabase();
    this.middlewareConfigure();
    this.routesConfigure();
    this.server = this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }

  async connectDatabase() {
    try {
      await mongoose.connect(this.databaseUrl, { useNewUrlParser: true });
      console.log('Connected to the database');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }

  middlewareConfigure() {
    this.app.use(express.json());
  }

  routesConfigure() {
    const matchRouter = require('./routes/routing');
    this.app.use('/matchHub', matchRouter);
  }
}

const match = new matchServer(9000, 'mongodb://localhost:27017/Match');
match.setUp();

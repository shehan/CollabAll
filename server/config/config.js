module.exports = {
  "development": {
    "username": "bd8fdea224eabf",
    "password": "94b5a7d3",
    "database": "database_dev",
    "host": "us-cdbr-azure-east2-d.cloudapp.net",
	"storage": "database_dev.sqlite",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
	"storage": "database_test.sqlite",
    "dialect": "sqlite"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
	"storage": "database_prod.sqlite",
    "dialect": "sqlite"
  }
};

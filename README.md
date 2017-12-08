## Installation instructions
1. Git clone the repo ```git clone [url]``` and remove origin ```git remote remove origin```
2. npm install the packages ```npm install```
3. Configure development database. If using postgresql create a new psql database in terminal and change reference (see knexfile.js for instructions)
4. Run knex database migrations ```npm run bootstrap```
5. Start server ```npm run dev```
6. Create your own database tables by rolling back knex migrations ```knex migrate:rollback``` then creating new migration ```knex migrate:make newtables```, configure knex table (see migraiton folder for exmaples or visit knex website), then migrate ```knex migrate:latest```
7. Change relevant seed files, models, routes and controllers
8. Write tests in the test folder and run mocha in terminal to test files

## Configuration

Configuration is stored in .env files are used for storing configuration.
Follow .env.example for usage.

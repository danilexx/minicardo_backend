import { createConnection, getConnectionOptions } from "typeorm";
import server from "./app";

const start = async () => {
  // read connection options from ormconfig file (or ENV variables)
  const connectionOptions = await getConnectionOptions();

  // do something with connectionOptions,
  // for example append a custom naming strategy or a custom logger
  Object.assign(connectionOptions, {
    migrations: [`${__dirname}/database/migrations/**/*.**`],
    entities: [`${__dirname}/app/models/**/*.**`],
    subscribers: [`${__dirname}/app/subscribers/**/*.**`],
  });

  createConnection(connectionOptions)
    .then(() => {
      server.listen(process.env.PORT || 3333, () => {
        console.log(`starting on ${process.env.PORT || 3333} `);
      });
    })
    .catch(console.error);
};

start();

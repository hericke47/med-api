module.exports = {
  type: "postgres",
  host:
    process.env.NODE_ENV === "test"
      ? process.env.POSTGRES_HOST_TEST
      : process.env.POSTGRES_HOST,
  port:
    process.env.NODE_ENV === "test"
      ? process.env.POSTGRES_PORT_TEST
      : process.env.POSTGRES_PORT,
  username:
    process.env.NODE_ENV === "test"
      ? process.env.POSTGRES_USER_TEST
      : process.env.POSTGRES_USER,
  password:
    process.env.NODE_ENV === "test"
      ? process.env.POSTGRES_PASS_TEST
      : process.env.POSTGRES_PASS,
  database:
    process.env.NODE_ENV === "test"
      ? process.env.POSTGRES_DB_TEST
      : process.env.POSTGRES_DB,
  entities: ["./src/modules/**/infra/typeorm/entities/*.ts"],
  migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
  cli: {
    migrationsDir: "./src/shared/infra/typeorm/migrations",
  },
};

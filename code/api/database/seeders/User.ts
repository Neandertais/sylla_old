import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        username: "mateus",
        email: "mateus@email.email",
        password: "mateus123",
      },
      {
        username: "fernando",
        email: "fernando@email.email",
        password: "fernando123",
      },
    ]);
  }
}

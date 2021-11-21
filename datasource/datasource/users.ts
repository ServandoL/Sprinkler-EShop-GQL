import { DataSource } from "apollo-datasource";
import _ from "lodash";
const data = require("../../mongo/User.json");

export class UsersApi extends DataSource {
  constructor() {
    super();
  }

  initialize(config: any) {}

  getUsers(args: any) {
    return _.filter(data, args);
  }

  getUserById(id: string) {
    const user = _.filter(data, { id: id });
    return user[0];
  }
}

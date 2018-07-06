import Base from './base.js';
import Rest from './rest.js';
const namespace = "account";
const actions = Rest(namespace);

class controller extends Base {
  async aaaAction() {
    return this.success("aaa");
  }
}
module.exports = controller;
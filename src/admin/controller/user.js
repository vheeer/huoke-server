const Base = require('./base.js');
const Rest = require('./rest.js');
//指定需要查询的字段
const columns = ["id", "mobile", "real_name", "content"];
const { readAction, createAction, updateAction, deleteAction, changeImageAction } = Rest("user", columns);

class top extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const model = this.model('topic');
    const data = await model.where({title: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  async infoAction() {
    const id = this.get('id');
    const model = this.model('topic');
    const data = await model.where({id: id}).find();

    return this.success(data);
  }

  async storeAction() {
    if (!this.isPost) {
      return false;
    }

    const values = this.post();
    const id = this.post('id');

    const model = this.model('topic');
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  async destoryAction() {
    const id = this.post('id');
    await this.model('topic').where({id: id}).limit(1).delete();
    // TODO 删除图片

    return this.success();
  }
};
top.prototype.readAction = readAction;
top.prototype.createAction = createAction;
top.prototype.updateAction = updateAction;
top.prototype.deleteAction = deleteAction;
top.prototype.changeImageAction = changeImageAction;
module.exports = top;

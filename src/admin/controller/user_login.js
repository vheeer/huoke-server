import Base from './base.js';
import Rest from './rest.js';
const namespace = "account";
const actions = Rest(namespace);

class controller extends Base {
  async indexAction() {
    
    const { userName, password } = this.post();
    const { ip } = this.ctx;
    console.log("userName", userName, "password", password);
    const account = await this.model("account", "mch").where({ acc: userName, psd: password }).find();
    const id = account.id;
    if(id){
        this.ctx.cookies.set('login', '1', { maxAge: 3600*24*3*1000, httpOnly: false });
        this.ctx.cookies.set('userName', userName, { maxAge: 3600*24*3*1000, httpOnly: false });
        this.ctx.cookies.set('id', "" + id, { maxAge: 3600*24*3*1000, httpOnly: false });
        try{
            const result = await this.model("admin_record", userName).add({
                username: userName,
                login_ip: ip,
                add_time: parseInt(Date.now()/1000),
                is_success: 1
            });
        }catch(e){
            console.log("add_admin_record err: ", e);
        }
        return this.success({ mes: "success" });
    }else{
        this.ctx.cookies.set('login', '0', { maxAge: 3600*24*1*1000, httpOnly: false });
        this.ctx.cookies.set('userName', "userName", { maxAge: -3600*24*1*1000, httpOnly: false });
        this.ctx.cookies.set('id', "id", { maxAge: -3600*24*1*1000, httpOnly: false });
        try{
            console.log();
            const result = await this.model("admin_record", userName).add({
                userName,
                login_ip: ip,
                add_time: parseInt(Date.now()/1000),
                is_success: 0
            });
        }catch(e){
            console.log("add_admin_record err: ", e);
        }
        return this.fail("账号或密码错误");
    }
  }
}
Object.assign(controller.prototype, actions);
module.exports = controller;

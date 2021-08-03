(function () {
  let username = document.querySelector('.username');
  let spanusername = document.querySelector('.spanusername');
  let man = document.querySelector('#man');
  let woman = document.querySelector('#woman');
  let useremail = document.querySelector('.useremail');
  let spanuseremail = document.querySelector('.spanuseremail');
  let userphone = document.querySelector('.userphone');
  let spanuserphone = document.querySelector('.spanuserphone');
  let userdepartment = document.querySelector('.userdepartment');
  let userdesc = document.querySelector('.userdesc');
  let userjob = document.querySelector('.userjob');
  let submit = document.querySelector('.submit');
  /*
 * queryURLParams:URL地址栏参数信息的解析
 *   @params
 *   @return
 *     [object]:包含问号参数信息及哈希值的对象
 */
  String.prototype.queryURLParams = function queryURLParams () {
    let obj = {};
    this.replace(/#([^?=#&]+)/g, (_, $1) => obj['HASH'] = $1);
    this.replace(/([^?=#&]+)=([^?=#&]+)/g, (_, $1, $2) => obj[$1] = $2);
    return obj;
  };
  //获取传递的userId  有传递就是修改  没有就是新增
  let userId;
  let obj = location.href.queryURLParams();
  userId = obj.userId;
  //修改数据
  const queryUserInfo = async function queryUserInfo () {
    let result = await axios.get('/user/info', {
      params: {
        userId
      }
    });
    if (+result.code !== 0) {
      alert('当前用户不存在');
      submit.style.display = 'none';
      return;
    };
    submit.style.display = 'block';
    let { name, sex, email, phone, departmentId, jobId, desc } = result.data;
    username.value = name;
    useremail.value = email;
    userphone.value = phone;
    userdepartment.value = departmentId;
    userjob.value = jobId;
    userdesc.value = desc;
    (+sex === 0) ? man.checked = true : woman.checked = true;
  }
  //渲染数据
  const bindDepartList = async function bindDepartList () {
    //获取数据
    let department = sessionStorage.getItem('department');
    if (department) {
      department = JSON.parse(department)
    } else {
      let result = await axios.get('/department/list');
      if (+result.code !== 0) return;
      department = result.data;
      sessionStorage.setItem('department', JSON.stringify(department))
    }
    //绑定数据
    let str = ``;
    department.forEach(item => {
      let { id, name } = item;
      str += `<option value="${id}">${name}</option>`
    });
    userdepartment.innerHTML = str;
  }
  const bindJobList = async function bindJobList () {
    let job = sessionStorage.getItem('job');
    if (job) {
      job = JSON.parse(job);
    } else {
      let result = await axios.get('/job/list');
      if (+result.code !== 0) return;
      job = result.data;
      sessionStorage.setItem('job', JSON.stringify(job));
    }
    let str = ``;
    job.forEach(item => {
      let { name, id } = item;
      str += `<option value="${id}">${name}</option>`
    })
    userjob.innerHTML = str
  }
  //部门和职务都完成 才能执行修改数据的函数
  Promise.all([bindDepartList(), bindJobList()]).then(() => {
    if (userId) {
      queryUserInfo();
    };
  });
  //校验邮箱
  const checkUserName = function checkUserName () {
    let name = username.value.trim();
    if (name.length === 0) {
      spanusername.innerHTML = '用户名为必填项哦~~~';
      return false;
    }
    let regName = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{1,10})?$/;
    if (!regName.test(name)) {
      spanusername.innerHTML = '必须是真实姓名哦~~';
      return false
    }
    spanusername.innerHTML = '';
    return true;
  }
  username.onblur = checkUserName;

  //校验用户名
  const checkUserEmail = function checkUserEmail () {
    let email = useremail.value.trim();
    if (email.length === 0) {
      spanuseremail.innerHTML = '用户名为必填项哦~~~';
      return false;
    }
    let regPhone = /^1\d{10}$/;
    let regEmail = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!regEmail.test(email)) {
      spanuseremail.innerHTML = '邮箱输入的不对哦~~';
      return false
    }
    spanuseremail.innerHTML = '';
    return true;
  }
  useremail.onblur = checkUserEmail;

  //校验手机号
  const checkUserPhone = function checkUserPhone () {
    let phone = userphone.value.trim();
    if (phone.length === 0) {
      spanuserphone.innerHTML = '手机号为必填项哦~~~';
      return false;
    }
    let regPhone = /^1\d{10}$/;
    if (!regPhone.test(phone)) {
      spanuserphone.innerHTML = '手机号输入的不对哦~~';
      return false
    }
    spanuserphone.innerHTML = '';
    return true;
  }
  userphone.onblur = checkUserPhone;
  //提交信息
  submit.onclick = async function () {
    if (!checkUserName() || !checkUserPhone() || !checkUserEmail()) return;
    let name = username.value.trim();
    let sex = man.checked ? 0 : 1;
    let email = useremail.value.trim();
    let phone = userphone.value.trim();
    let departmentId = userdepartment.value;
    let jobId = userjob.value;
    let desc = userdesc.value.trim();
    //把信息提交给服务器:区分是新增还是修改
    let url = '/user/add';
    let body = {
      name,
      sex,
      email,
      phone,
      departmentId,
      jobId,
      desc
    };
    if (userId) {
      url = '/user/update';
      body.userId = userId;
    }
    let result = await axios.post(url, body);
    if (+result.code !== 0) {
      alert('当前操作失败，请稍后再试');
      return;
    }
    alert('恭喜您  新增成功啦~~~');
    location.href = 'userlist.html';
  }
})()
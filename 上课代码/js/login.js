(function () {
  let userName = document.querySelector('.userName');
  let userPass = document.querySelector('.userPass');
  let submit = document.querySelector('.submit');
  submit.onclick = async function () {
    let account = userName.value.trim();
    let password = userPass.value.trim();
    //输入内容格式的校验
    if (account.length === 0 || password.length === 0) {
      alert('账号和密码是必填项哦~~😊');
      return;
    };
    let regName = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{1,10})?$/;
    let regPhone = /^1\d{10}$/;
    let regEmail = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    let regPass = /^[0-9a-zA-Z]{6,16}$/;
    if (!regName.test(account) && !regPhone.test(account) && !regEmail.test(account)) {
      alert('账号不合法哦~~');
      return;
    }
    if (!regPass.test(password)) {
      alert('密码不合法哦~~');
      return
    }
    //密码加密
    password = md5(password);
    // 数据提交给服务器
    let result = await axios.post('/user/login', {
      account,
      password
    });
    if (+result.code === 1) {//登录失败
      alert('账号和密码不匹配哦~~请修改后再尝试~~');
      return;
    }
    alert('恭喜！！登录成功啦~~~');
    location.href = 'index.html';
  };
})()
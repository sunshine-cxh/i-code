//发布订阅
(function () {
  let listeners = {};

  // 向事件池中追加方法
  const on = function on (type, func) {
    let arr = listeners[type];
    if (!arr) {
      listeners[type] = [];
      arr = listeners[type];
    }
    if (arr.includes(func)) return;
    arr.push(func);
  };

  // 从事件池中移除方法
  const off = function off (type, func) {
    let arr = listeners[type] || [],
      index = arr.indexOf(func);
    if (index === -1) return;
    arr[index] = null;
  };

  // 通知事件池中指定的方法执行
  const emit = function emit (type, ...params) {
    let arr = listeners[type] || [],
      i = 0,
      item;
    for (; i < arr.length; i++) {
      item = arr[i];
      if (typeof item === "function") {
        item(...params);
        continue;
      }
      arr.splice(i, 1);
      i--;
    }
  };

  /* 暴露API */
  let $sub = {
    on,
    off,
    emit
  };
  if (typeof module === "object" && typeof module.exports === "object") module.exports = $sub;
  if (typeof window !== "undefined") window.$sub = $sub;
})();
(function () {
  let navBox = document.querySelector('.navBox');
  let baseBox = document.querySelector('.baseBox');
  let baseText = baseBox.querySelector('span');
  let signoutBtn = baseBox.querySelector('a');
  let menuBox = document.querySelector('.menuBox');
  let itemBoxList = null;
  //用户信息
  let bindBaseInfo = async function bindBaseInfo () {
    let { data, code } = await axios.get('/user/info');
    if (+code === 0) {
      let { name } = data;
      baseText.innerHTML = `您好：${name}`

    }
  }
  $sub.on('INDEX', bindBaseInfo);
  //退出登录
  let signout = function signout () {
    signoutBtn.onclick = async function () {
      //给用户一个提示  确定退出登录吗？
      let flag = confirm('您确定要退出登录吗？🥺');
      if (!flag) return;
      let { code } = await axios.get('/user/signout');
      alert('退出成功啦，即将离开首页😀')
      location.href = 'login.html'
    }
  }
  $sub.on('INDEX', signout)
  //权限判断// userhandle|departhandle|jobhandle|customerall
  let checkPower = async function checkPower () {
    let { power, code } = await axios.get('/user/power');
    if (+code === 1) return;
    //获取到权限后
    let str = ``;
    str += `
    <div class="itemBox" text="客户管理">
      <h3>
        <i class="iconfont icon-kehuguanli"></i>
        客户管理
      </h3>
      <nav class="item">
        <a href="page/customerlist.html?lx=my" target="iframeBox">我的客户</a>
        ${power.includes('customerall') ? `<a href="page/customerlist.html?lx=all" target="iframeBox">全部客户</a>` : ``}
        <a href="page/customeradd.html" target="iframeBox">新增客户</a>
      </nav>
    </div>
    `
    if (power.includes('departhandle')) {
      str += `	<div class="itemBox" text="部门管理">
      <h3>
        <i class="iconfont icon-guanliyuan"></i>
        部门管理
      </h3>
      <nav class="item">
        <a href="page/departmentlist.html" target="iframeBox">部门列表</a>
        <a href="page/departmentadd.html" target="iframeBox">新增部门</a>
      </nav>
    </div>`
    }
    if (power.includes('jobhandle')) {
      str += `<div class="itemBox" text="职务管理">
      <h3>
        <i class="iconfont icon-zhiwuguanli"></i>
        职务管理
      </h3>
      <nav class="item">
        <a href="page/joblist.html" target="iframeBox">职务列表</a>
        <a href="page/jobadd.html" target="iframeBox">新增职务</a>
      </nav>
    </div>`
    }
    if (power.includes('userhandle')) {
      str += `<div class="itemBox" text="员工管理">
      <h3>
        <i class="iconfont icon-yuangong"></i>
        员工管理
      </h3>
      <nav class="item">
        <a href="page/userlist.html" target="iframeBox">员工列表</a>
        <a href="page/useradd.html" target="iframeBox">新增员工</a>
      </nav>
    </div>`
    }
    menuBox.innerHTML = str;
    itemBoxList = Array.from(menuBox.querySelectorAll('.itemBox'));
    navBoxList = Array.from(navBox.querySelectorAll('a'))
    //点击主导航切换权限
    const change = (lx = 0) => {
      itemBoxList.forEach(item => {
        let text = item.getAttribute('text');
        if (lx === 0) {
          item.style.display = text === '客户管理' ? 'block' : 'none'
        } else {
          item.style.display = text === '客户管理' ? 'none' : 'block'
        }
      })
      //控制nav选中状态
      navBoxList.forEach((item, index) => {
        if (lx === index) {
          item.className = 'active';
          return
        }
        item.className = '';
      })
    }
    change(0);
    navBox.onclick = function (ev) {
      let target = ev.target;
      let targetTag = target.tagName;
      targetText = target.innerText.trim();
      if (targetTag === 'A') {
        if (targetText === '客户管理') {
          change(0)
          return;
        }
        if (!/(userhandle|departhandle|jobhandle)/i.test(power)) {
          alert('没有权限哦~~~');
          return
        }
        change(1)
      }
    }
  }
  $sub.on('INDEX', checkPower)


  //进入首页第一件事  校验是否登录，没有登录就跳到登录页
  const initLogin = async function initLogin () {
    try {
      let { code } = await axios.get('/user/login');
      if (+code === 1) {
        alert('请先登录哦😯');
        location.href = 'login.html'
      }
      $sub.emit('INDEX');
    } catch (error) {
      location.href = 'login.html'
    }
  };
  initLogin();

})()
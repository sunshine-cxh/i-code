(function () {
  let filterBox = document.querySelector('.filterBox');
  let deleteAll = filterBox.querySelector('.deleteAll');
  let selectBox = filterBox.querySelector('.selectBox');
  let searchInp = filterBox.querySelector('.searchInp');
  let tableBox = document.querySelector('.tableBox')
  let checkAll = tableBox.querySelector('#checkAll')
  let tbody = tableBox.querySelector('tbody')
  let userListData = [];

  // 根据获取的数据渲染页面
  const render = function render () {
    let str = ``;
    userListData.forEach(item => {
      let { id, selected, name, department, job, sex, email, phone, desc } = item;
      str += `
      <tr>
      <td class="w3"><input data-id="${id}" type="checkbox" ${selected ? 'checked' : ''}></td>
      <td class="w10">${name}</td>
      <td class="w5">${+sex === 0 ? '男' : '女'}</td>
      <td class="w10">${department}</td>
      <td class="w10">${job}</td>
      <td class="w15">${email}</td>
      <td class="w15">${phone}</td>
      <td class="w20">${desc}</td>
      <td class="w12">
        <a href="useradd.html?userId=${id}">编辑</a>
        <a href="javascript:;">删除</a>
        <a href="javascript:;">重置密码</a>
      </td>
    </tr> `
    })
    tbody.innerHTML = str;
  }
  //从服务器获取员工的数据 PARAMS：departmentId=0&search=''
  const queryUserList = async function queryUserList () {
    //获取下拉框和input输入的内容
    let departmentId = selectBox.value;
    let search = searchInp.value.trim();
    try {
      //发请求获取数据
      let result = await axios.get('/user/list', {
        params: {
          departmentId,
          search
        }
      });
      if (+result.code !== 0) {
        //没有数据
        userListData = [];
        render();
        return;
      };
      //获取到数据   !!给数据每一项设置上selected属性  默认是false
      userListData = result.data;
      userListData = userListData.map(item => {
        item.selected = false;
        return item
      })
      render()
    } catch (error) {
      //请求失败
      userListData = [];
      render();
    }
    //每一次重新获取数据，把checkAll状态清空
    checkAll.checked = '';
  }
  //获取所有部门信息  并且展示在下拉框中  下拉框切换控制表格数据 缓存处理
  const queryDepartList = async function queryDepartList () {
    let data = sessionStorage.getItem('department');
    if (data) {
      data = JSON.parse(data);
    } else {
      // 获取数据
      let result = await axios.get('/user/list');
      if (+result.code !== 0) return;
      data = result.data;
      sessionStorage.setItem('department', JSON.stringify(data))
    }
    // 数据绑定
    let str = ``;
    data.forEach(item => {
      let { id, name } = item;
      str += `
      <option value="${id}">${name}</option>
      `
    })
    selectBox.innerHTML += str;
  };
  queryDepartList();
  //下拉框改变
  selectBox.onchange = queryUserList;
  // 按照input输入内容模糊搜索
  searchInp.onkeydown = function (ev) {
    if (ev.keyCode === 13) {
      //按下enter  重新获取数据
      queryUserList()
    };
  };
  //全选全部选
  checkAll.onclick = function () {
    userListData.map((item, index) => {
      item.selected = checkAll.checked;
      return item;
    });
    render();
  }
  // 点击列表的每一项，控制当前这项的的状态
  tbody.onclick = function (ev) {
    let target = ev.target,
      targetTag = target.tagName;
    if (targetTag === "INPUT") {
      // 点击每一项的复选框,让自身的状态变为TRUE/FALSE
      let id = target.getAttribute('data-id'), flag = false;
      userListData = userListData.map(item => {
        if (+id === +item.id) {
          //点击的是这个
          item.selected = target.checked;
        }
        return item;
      });
      //控制checkAll
      flag = userListData.every(item => item.selected === true);
      checkAll.checked = flag;
      render()
    }
  }
  //开始加载页面获取所有用户信息
  queryUserList();
})()  
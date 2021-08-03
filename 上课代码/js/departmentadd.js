(function () {
  let input = document.querySelector('.inpBox input');
  let textarea = document.querySelector('textarea');
  let tip1 = document.querySelector('.tip1');
  let tip2 = document.querySelector('.tip2');
  let submit = document.querySelector('.submit')
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
  let departmentId;
  let obj = location.href.queryURLParams();
  departmentId = obj.departmentId;
  //修改数据
  const queryInfo = async function queryInfo () {
    let result = await axios.get('/department/info', {
      params: {
        departmentId
      }
    });
    if (+result.code !== 0) {
      alert('瞎搞啥啊');
      return;
    }
    let { desc, name } = result.data;
    input.value = name;
    textarea.value = desc
  }
  if (departmentId) {
    queryInfo();
  }

  //检测部门名称
  const checkName = function checkName () {
    let name = input.value.trim();
    if (name.length === 0) {
      tip1.innerHTML = `部门名称不能为空哦~~~`;
      return false;
    }
    tip1.innerHTML = '';
    return true;
  }
  //检测部门描述
  const checkDesc = function checkDesc () {
    let desc = textarea.value.trim();
    if (desc.length === 0) {
      tip2.innerHTML = `部门描述不能为空哦~~~`;
      return false;
    }
    tip2.innerHTML = '';
    return true;
  }
  //提交数据给服务器
  submit.onclick = async function () {
    if (!checkName() || !checkDesc()) return;
    // /department/add  name=xxx&desc=xxx
    // /department/update  departmentId=1&name=xxx&desc=xxx
    let name = input.value.trim();
    let desc = textarea.value.trim();
    let url = '/department/add';
    let body = {
      name,
      desc
    }
    if (departmentId) {
      url = '/department/update';
      body.departmentId = departmentId
    };
    let result = await axios.post(url, body);
    if (+result.code !== 0) {
      alert('操作失败  稍后再试');
      return;
    }
    alert('恭喜你  操作成功！！！');
    location.href = 'departmentlist.html';
  }
})()
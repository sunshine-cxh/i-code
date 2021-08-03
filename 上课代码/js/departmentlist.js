(function () {
  let tbody = document.querySelector('tbody');
  let departmentListData = [];
  const render = function render () {
    let str = ``;
    departmentListData.forEach(item => {
      let { desc, name, id } = item
      str += `<tr>
      <td class="w10">${id}</td>
      <td class="w20">${name}</td>
      <td class="w40">${desc}</td>
      <td class="w20">
        <a href="departmentadd.html?departmentId=${id}">编辑</a>
        <a href="javascript:;">删除</a>
      </td>
    </tr>`
    })
    tbody.innerHTML = str;
  }
  const queryDataList = async function queryDataList () {
    try {
      let result = await axios.get('/department/list');
      if (+result.code !== 0) {
        departmentListData = [];
        render();
        return;
      }
      departmentListData = result.data;
      render();
    } catch (error) {
      //请求失败
      departmentListData = [];
      render();
    }
  }
  queryDataList()
})()
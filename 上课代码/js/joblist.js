(function () {
  let tbody = document.querySelector('tbody');
  let jobListData = [];
  const render = function render () {
    let str = ``;
    jobListData.forEach(item => {
      let { desc, name, id, power } = item
      str += `<tr>
      <td class="w8">${id}</td>
      <td class="w10">${name}</td>
      <td class="w20">${desc}</td>
      <td class="w50">${power}</td>
      <td class="w12">
        <a href="jobadd.html?jobId=${id}">编辑</a>
        <a href="javascript:;">删除</a>
      </td>
    </tr>`
    })
    tbody.innerHTML = str;
  }
  const queryDataList = async function queryDataList () {
    try {
      let result = await axios.get('job/list');
      if (+result.code !== 0) {
        jobListData = [];
        render();
        return;
      }
      jobListData = result.data;
      render();
    } catch (error) {
      //请求失败
      jobListData = [];
      render();
    }
  }
  queryDataList()
})()
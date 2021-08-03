(function () {
  let tbody = document.querySelector('tbody');
  const render = async function render () {
    let result = await axios.get('/department/list');
    console.log(result)
    let { data } = result
    let str = ``;
    data.forEach(item => {
      let { desc, name, id } = item
      str += `<tr>
      <td class="w10">${id}</td>
      <td class="w20">${name}</td>
      <td class="w40">${desc}</td>
      <td class="w20">
        <a href="javascript:;">编辑</a>
        <a href="javascript:;">删除</a>
      </td>
    </tr>`
    })
    tbody.innerHTML = str;
  }
  render()
})()
(function () {
  let tbody = document.querySelector('tbody');
  const render = async function render () {
    let result = await axios.get('/job/list');
    console.log(result)
    let { data } = result
    let str = ``;
    data.forEach(item => {
      let { power,desc, name, id } = item
      str += `<tr>
      <td class="w8">${id}</td>
      <td class="w10">${name}</td>
      <td class="w20">${desc}</td>
      <td class="w50">${power}</td>
      <td class="w12">
        <a href="javascript:;">编辑</a>
        <a href="javascript:;">删除</a>
      </td>
    </tr>`
    })
    tbody.innerHTML = str;
  }
  render()
})()
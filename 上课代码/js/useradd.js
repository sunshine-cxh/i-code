

/*
 * @Author: your name
 * @Date: 2021-08-03 22:08:48
 * @LastEditTime: 2021-08-04 01:19:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \新建文件夹 (3)\0802\js\useradd.js
 */
(function () {
    let username = document.querySelector(".username"),
        spanusername = document.querySelector(".spanusername"),
        man = document.querySelector("#man"),
        woman = document.querySelector("#woman"),
        useremail = document.querySelector(".useremail"),
        spanuseremail = document.querySelector(".spanuseremail"),
        userphone = document.querySelector(".userphone"),
        spanuserphone = document.querySelector(".spanuserphone"),
        userdepartment = document.querySelector(".userdepartment"),
        userjob = document.querySelector(".userjob"),
        userdesc = document.querySelector(".userdesc"),
        submit = document.querySelector(".submit");

    /*
     * queryURLParams:URL地址栏参数信息的解析
     *   @params
     *   @return
     *     [object]:包含问号参数信息及哈希值的对象
     * by zhouxiaotian on 2021/07/06
     */
    String.prototype.queryURLParams = function queryURLParams() {
        let obj = {};
        this.replace(/#([^?=#&]+)/g, (_, $1) => obj['HASH'] = $1);
        this.replace(/([^?=#&]+)=([^?=#&]+)/g, (_, $1, $2) => obj[$1] = $2);
        return obj;
    };

    // 获取我们传递的 userId ：有传递就是修改员工信息，没有传递就是新增员工
    let userId;
    let obj = location.href.queryURLParams()
    userId = obj.userId;
    console.log(userId);

    //如果是修改的话，我们需要获取当前用户的信息，放在指定的文本框中
    const queryUserInfo = async function queryUserInfo() {
        let result = await axios.get("/user/info", {
            params: {
                userId
            }
        });
        if (+result.code !== 0) {
            alert("当前用户不存在，请查证");
            submit.getElementsByClassName.display = "none"
            return;
        } //新增细节处理  submit.getElementsByClassName.display="block" 
        submit.getElementsByClassName.display = "block"
        let {
            name,
            email,
            sex,
            phone,
            department,
            jobId,
            desc
        } = result.data;
        username.value = name;
        useremail.value = email;
        userphone.value = phone;
        userdepartment.value = department;
        jobId.value = jobId;
        userdesc.value = desc;
        // 确保sex是数字
        (+sex === 0) ? man.checked = true: woman.checked = true;
    }

    ///   把方法执行先去掉，放在下面执行
    // 绑定部门信息
    const bindDepartList = async function bindDepartList() {
        // 从本地获取服务器端获取部门列表
        let department = sessionStorage.getItem('department');
        if (department) {
            department = JSON.parse(department)
        } else {
            let result = await axios.get('/department/list');
            if (+result.code !== 0) return;
            department = result.data;
            sessionStorage.setItem('department', JSON.stringify(department))
        }

        // 绑定数据
        let str = ``;
        department.forEach(item => {
            let {
                id,
                name
            } = item;
            str += `<option value="${id}">${name}</option>`;
        })
        userdepartment.innerHTML = str;
    } // bindDepartList();

    //绑定职务信息
    const bindJobList = async function bindJobList() {
        // 从本地获取服务器端职务信息
        let job = sessionStorage.getItem('job');
        if (job) {
            job = JSON.parse(job);
        } else {
            let result = await axios.get('/job/list');
            if (+result.code !== 0) return;
            job = result.data;
            sessionStorage.setItem("job", JSON.stringify(job))
        }
        //实现数据绑定
        let str = ``;
        job.forEach(item => {
            let {
                id,
                name
            } = item;
            str += `<option value="${id}">${name}</option>`
        })
        userjob.innerHTML = str;
    } // bindJobList();

    // 我们要保证部门和职务信息都绑定完了，在去获取修改用户信息
    Promise.all([bindDepartList(), bindJobList()]).then(() => {
        if (userId) {
            queryUserInfo();
        }
    })




    // ====   下面是手动操作触发  ====================================


    // 校验用户名
    const checkUserName = function checkUserName() {
        let name = username.value.trim();
        if (name.length === 0) {
            spanusername.innerHTML = "用户名不能为空"
            return false;
        }
        if (!/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{1,10})?$/.test(name)) {
            spanusername.innerHTML = "用户名必须为真实姓名"
            return false;
        }
        spanusername.innerHTML = '';
        return true
    }
    username.onblur = checkUserName;

    // 校验邮箱
    const checkUserEmail = function checkUserEmail() {
        let email = useremail.value.trim();
        if (email.length === 0) {
            spanuseremail.innerHTML = "邮箱不能为空"
            return false;
        }
        if (!/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email)) {
            spanuseremail.innerHTML = "必须为有效邮箱"
            return false;
        }
        spanuseremail.innerHTML = '';
        return true
    }
    useremail.onblur = checkUserEmail;

    //校验手机号
    const checkUserPhone = function checkUserPhone() {
        let phone = userphone.value.trim();
        if (phone.length === 0) {
            spanuserphone.innerHTML = "此处不能为空"
            return false;
        }
        if (!/^[0-9a-zA-Z]{6,16}$/.test(phone)) {
            spanuserphone.innerHTML = "请输入正确的手机号"
            return false;
        }
        spanuserphone.innerHTML = '';
        return true
    }
    userphone.onblur = checkUserPhone;

    // 提交信息
    submit.onclick = async function () {
        // 先表单校验
        if (!checkUserName() || !checkUserEmail() || !checkUserPhone()) return;
        //获取用户输入信息
        let name = username.value.trim(),
            sex = man.checked ? 0 : 1,
            email = useremail.value.trim(),
            phone = userphone.value.trim(),
            department = userdepartment.value.trim(),
            jobId = userjob.value.trim(),
            desc = userdesc.value.trim();
        // 把信息提交给服务器： 区分是新增还是修改
        // submit.onclick 提交代码处的修改
        let url = '/user/add',
            body = {
                name,
                sex,
                email,
                phone,
                department,
                jobId,
                desc
            }
            if(userId){
                // 修改
                url = '/user/update',
                body.userId=userId;
            }
        let result = await axios.post(url,body);
        if (+result.code !== 0) {
            alert("操作失败 请您稍后再试")
            return
        }
        alert("操作成功")
        location.href = "userlist.html"
    }
})()

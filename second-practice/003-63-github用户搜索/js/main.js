// document.write('<script src="./lib/rq.js"></script>');
; (function () {
    'use strict';
    let form = document.getElementById('search-form');
    let input = form.querySelector('[name=keyword]');
    let userList = document.querySelector('.user-list');
    let $ = rq;
    let pageLimit = 7;//每页显示的用户数

    start();

    function start() {
        bindEvents();
    }
    function bindEvents() {


        form.addEventListener('submit', e => {
            e.preventDefault();
            let keyWord = input.value;
            search(keyWord);
        })

        function search(keyWord, current = 1) {
            userList.innerHTML = '';
            if (!keyWord) {
                alert('请输入搜索内容');
                return;
            }
            let url = `https://api.github.com/search/users?q=${keyWord}&page=${current}&per_page=${pageLimit}`;
            $.get(url).then(data => {
                //创建翻页组件
                pagination.start({
                    limit: pageLimit,
                    amount: data.total_count > 1000 ? 1000 : data.total_count,
                    el: '#pagination',
                    current,
                    onChange(page) {
                        console.log(page);
                        if (current == page)
                            return;
                        current = page;
                        search(keyWord, current);
                    }
                })
                render(data);
            });
        }
        function render(data) {
            let users = data.items;
            users && users.forEach(user => {
                let item = document.createElement('div');
                item.classList.add('item');
                item.innerHTML = `
                <div class="avatar">
                    <img src=${user.avatar_url} alt="用户头像">
                </div>
                <div class="detail">
                    <strong><a target="_blank" href=${user.html_url}>${user.login}</a></strong>
                    <div><a target="_blank" href=${user.html_url}>${user.html_url}</a></div>
                </div>
                `
                userList.appendChild(item);
            })
        }
    }
})();
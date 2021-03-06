var batch_size = 20;
var keyw = 'The Internet Remembers---HW②㈤1';
var suff = '<p><br></p><p>=================The Internet Remembers---HW②㈤1=================</p>' + 
            '<p>[苯后缀ゐ腳本鉎荿]</p><p>华为员工因举报造假被迫离职，因要求合理的离职赔偿被诬告羁押251天。资乎先降热度后删问题，近两千回答就此消失，并且还在持续删除相关内容</p>' + 
            '<p>但互联网是有记忆的，这件事没那么容易就此被抹去</p>' + 
            '<h2>部分暂时还没被删的资乎相关问题：</h2><p>请自行搜索关键词，为防自动删除链接已删</p>' +
            '<h2>被删问题的网页快照备份：</h2><p><a href="https://j.mp/2sBk2ZK">zhihu-huawei251/zhihu-huawei251</a> </p>' +
            '<h2>相关项目友链：</h2><p><a href="https://j.mp/34Hmmwi">(简介:由于部分内容被控评和删帖，已经无法在中文互联网搜索到，所以本项目将收集华为作过的恶，记录这些不应该被遗忘的历史。)</a></p>' +
            '<p><b>不需要任何编程基础，不需要安装任何工具</b>，访问 <a href="https://j.mp/37YW5vo">此Github地址</a> 获取脚本，复制到浏览器中运行，即可为自己的所有知乎回答加上本后缀 </p>';




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function update_batch(offset, url) {
    fetch(url+'?offset='+offset+'&limit='+batch_size)
        .then((e) => (e.json()))
        .then(async(j) => {
            for(let ans of j["data"]) {
                update(ans["id"]);
                await sleep(15000);
            }
            if(j["paging"]["is_end"]) {
                console.log("DONE!");
            }
            else {
                await sleep(45000);
                update_batch(offset+batch_size, url);
            }
        });
}

async function update(id) {
    console.log(id);
    let url ='https://www.zhihu.com/api/v4/answers/' + id + '?include=content';
    fetch(url)
        .then((e) => (e.json()))
        .then(async(j) => {
            let content = j["content"];
            console.log(content.substr(0,25) + '...');
            if(content.search(keyw) == -1) {
                content += suff;
                await sleep(4000);
                fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify({
		                'content': content
		            })
                });
            }
        });
}

async function U() {
    fetch('https://www.zhihu.com/api/v4/me')
        .then((e) => (e.json()))
        .then((j) => {
            let url = 'https://www.zhihu.com/api/v4/members/' + j["url_token"] +'/answers';
            update_batch(0, url);
        });
}

U();




/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global steem, post, max */

'use strict';

class Aplikace {

    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.bar = document.getElementById('bar');
        this.barText = document.getElementById('text');
        this.progressWidth = 10;
        this.inputTag = document.getElementById('tag');
        this.inputCountWeek = document.getElementById('week');
        this.btnLoad = document.getElementById('load');
        this.btnLoad.onclick = () => this.load();
        this.inputAddWeek = document.getElementById('addWeek');
        this.btnAddLoad = document.getElementById('addLoad');
        this.btnAddLoad.onclick = () => this.addLoad();
        this.selectNode = document.getElementById('node');
        this.selectNode.onchange = () => this.load();
        this.logo = document.getElementById('logo');
        this.diskord = document.getElementById('diskord');
        this.widget = document.getElementById('widget');
        this.diskord.onclick = () => {
            if (this.widget.style.visibility == "hidden") { this.widget.style.visibility = "visible"; }
            else { this.widget.style.visibility = "hidden"; }
        }
        this.title = document.getElementById('title');

        this.tag = this.inputTag.value;
        this.currentTime = new Date().getTime();
        this.day = 24 * 60 * 60 * 1000;//1 den v milisekundách
        this.week = this.day * 7;
        this.countWeek = this.inputCountWeek.value;
        this.time = this.currentTime - (this.day * (this.countWeek * 7));
        this.arrayAuthors = [];
        this.sortArrayPostsByTime = new Array(new Array());//seznam postů roztříděný do týdenních intervalů
        this.arrayAuthorsByTime = new Array(new Array());//seznam autorů roztřídených do týdenních intervalů a sloučené k sobě
        this.countPostFromBlockchain = 0;//celkem načtených postů 

        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.selectAuthorH3 = document.createElement('h3');
        this.selectAuthorH3.id = 'date';
        this.selectAuthorH3.className = 'divTable';
        this.tablePostsAuthor = document.createElement('table');
        this.tablePostsAuthor.className = 'divTable';
        this.tableAutors = document.createElement('table');
        this.tableAutors.id = "tableAuthors";
        this.divTable = document.createElement('div');//div kde se zobrazuje doplňková tabulka
        //this.divTable.id = 'divTable';
        this.divTable.className = 'divTable';

        this.load();
        //this.getDiscussionsByCreate();
    }

    load() {
        this.inicializace();
        this.tag = this.inputTag.value;
        this.countWeek = this.inputCountWeek.value;
        this.arrayAuthors = [];

        this.currentTime = new Date().getTime();
        this.time = this.currentTime - (this.day * (this.countWeek * 7));

        this.countPostFromBlockchain = 0;
        this.updateProgresBar('Načteno ' + this.countPostFromBlockchain + ' postů');
        this.progressWidth = 10;
        this.bar.style.width = this.progressWidth + '%';

        this.getDiscussionsByCreate();
    }

    addLoad() {
        this.inicializace();
        this.countWeek = parseInt(this.inputCountWeek.value) + parseInt(this.inputAddWeek.value);
        //console.log(this.countWeek);
        this.inputCountWeek.value = this.countWeek;
        this.time = this.currentTime - (this.day * (this.countWeek * 7));
        this.getDiscussionsByCreateNext(this.tag, 90, this.arrayAuthors[this.arrayAuthors.length - 1].author, this.arrayAuthors[this.arrayAuthors.length - 1].permlink);

        this.bar.style.width = 10 + '%';
    }

    inicializace() {
        this._disable(true);
        steem.api.setOptions({ url: this.selectNode.value });
        var titlePlatform;
        if (this.selectNode.value == 'https://api.steemit.com') {
            this.www = "https://www.steemit.com/";
            this.logo.src = "./img/steem.png";
            titlePlatform = "Steemit";
        } else {
            this.www = "https://www.peakd.com/";
            this.logo.src = "./img/hive.png";
            titlePlatform = "Hive"
        }
        this.title.innerText = "Česky píšící autoři na blockchainové platformě " + titlePlatform;
        while (this.tableAutors.lastChild) {
            this.tableAutors.removeChild(this.tableAutors.lastChild);
            //console.log(this.table.childNodes[i]);
            //console.log("i:");
        }
        while (this.tablePostsAuthor.lastChild) {
            this.tablePostsAuthor.removeChild(this.tablePostsAuthor.lastChild);
            //console.log(this.table.childNodes[i]);
            //console.log("i:");
        }
        while (this.divTable.lastChild) {
            this.divTable.removeChild(this.divTable.lastChild);
        }


        this.selectAuthorH3.textContent = '';
        this.sortArrayPostsByTime = new Array(new Array());//seznam postů roztříděný do týdenních intervalů
        this.arrayAuthorsByTime = new Array(new Array());//seznam autorů roztřídených do týdenních intervalů a sloučené k sobě

        var height = this.canvas.height;
        var width = this.canvas.width;
        this.context.clearRect(0, 0, width, height);
        this.progressBar.style.visibility = "visible";
        this.widget.style.visibility = "hidden";

    }

    getDiscussionsByCreate() {
        var count = 90;
        var query = {
            tag: this.tag,
            limit: count
            //start_author :  ' lada94 ' ,
            //start_permlink :  ' introduce-youself-steemit '
        };

        steem.api.getDiscussionsByCreated(query, (err, result) => {
            //console.log(err, result);

            this.countPostFromBlockchain += result.length;
            this.updateProgresBar('Načteno ' + this.countPostFromBlockchain + ' postů');
            //console.log(this.countPostFromBlockchain);
            //console.log(new Date().getTime()-this.day);
            //console.log(err, Date.parse(result[result.length-1].created));
            for (var post of result) {
                this.arrayAuthors.push(new Post(post.author, post.permlink, post.title, post.created));
            }
            if (result.length === count && Date.parse(result[result.length - 1].created) > this.time) {
                this.getDiscussionsByCreateNext(this.tag, count, result[count - 1].author, result[count - 1].permlink);
            } else {
                //console.log('showAutors');
                //this.showAutors();
                this.viewResult();
            }

        });
    }

    getDiscussionsByCreateNext(tag, count, author, permlink) {
        var query = {
            tag: tag,
            limit: count + 1,
            start_author: author,
            start_permlink: permlink
        };
        //console.log(query);

        steem.api.getDiscussionsByCreated(query, (err, result) => {
            //console.log(err, result);
            //this.vypis(result, false);
            //console.log(Date.parse(result[result.length-1].created));
            //console.log((result[result.length-1].created));
            this.countPostFromBlockchain += result.length;
            this.updateProgresBar('Načteno ' + this.countPostFromBlockchain + ' postů');
            for (var i = 1; i < result.length; i++) {
                var post = result[i];
                this.arrayAuthors.push(new Post(post.author, post.permlink, post.title, post.created));
            }
            if (result.length === (count + 1) && Date.parse(result[result.length - 1].created) > this.time) {
                //if(result.length === (count+1) && Date.parse(result[result.length-1].created) > this.time) {    
                this.getDiscussionsByCreateNext(tag, count, result[count].author, result[count].permlink);
            } else {
                //console.log('showAutors');
                //this.showAutors();
                this.viewResult();
            }
        });

    }

    sortPostsByTime() {
        //var today = new Date(2019, 1, 28, 11, 55, 0, 0);
        var today = new Date();
        var minus = today.getDay() - 4;
        if (today.getDay() < 4) minus = minus + 7;
        if (today.getDay() === 4 && today.getHours() < 12) minus = minus + 7;
        //console.log(today.getTime());
        //console.log(new Date(today.getFullYear(), today.getMonth(), today.getDate() - minus, 12, 0, 0, 0));
        this.thursday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - minus, 12, 0, 0, 0); //čas posledního čtvrtku - pozor na časové pásmo - středoevropské - podle nastavení lokálního prostředí v počítači klienta
        this.firstThursday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - minus, 12, 0, 0, 0);
        //this.firstThursday.setDate(this.thursday.getDate());
        var index = 0;
        for (var a of this.arrayAuthors) {
            if (Date.parse(a.time + '+00:00') >= this.thursday) this.sortArrayPostsByTime[index].push(a);
            else {
                index++;
                //nastavení datumu měnší o 7 dní/ pracuje i se změno letního času
                this.thursday.setDate(this.thursday.getDate() - (7));
                this.sortArrayPostsByTime.push(new Array());
                this.sortArrayPostsByTime[index].push(a);
            }
        }
        //console.log(this.sortArrayPostsByTime);
    }

    mergeAuthor() {
        for (var i = 0; i < (this.sortArrayPostsByTime.length); i++) {
            this.sortArrayPostsByTime[i].filter((post, index, self) => {
                var y = index === self.findIndex((t) => (t.author === post.author));

                if (!y) {
                    var ii = this.arrayAuthorsByTime[i].findIndex((t) => t.author === post.author);
                    this.arrayAuthorsByTime[i][ii].addPost(post.permlink, post.title, post.time);
                    //console.log('ii '+ii +' '+ post.author + ' ' + post.title);
                    //console.log(this.arrayAuthorsByTime[i][ii]);

                } else {
                    //console.log('Přidat:'+i+' '+post.author+' '+post.title);
                    if (this.arrayAuthorsByTime.length <= i) this.arrayAuthorsByTime.push(new Array());
                    this.arrayAuthorsByTime[i].push(new Author(post.author, post.permlink, post.title, post.time));
                }
                //return y;
            });
        }
        //console.log(this.arrayAuthorsByTime);
    }

    //detekce letního a zimního času
    detectDayLight(time) {
        console.log("offset " + new Date(this.firstThursday - (this.week * (index - 1)) - this.week + 1000).getTimezoneOffset());
        var timeOffset = new Date(time).getTimezoneOffset();
        var hour = 0;
        if (timeOffset === -60) { hour = 60 * 60 * 1000; }
        if (timeOffset === -120) { hour = 0; }
        return hour;
    }

    showHeadTable(index, x) {
        var result = '';
        var format = {
            //weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        };


        //pro počáteční i konečný termín musím detekci letního času počítat zvlášť
        var hour1 = 0;
        var hour2 = 0;

        //var dst1 = new DetectDayLight(this.firstThursday-(this.week*(index-1))-this.week+1000);
        var dst1 = new DetectDayLight(this.firstThursday - (this.week * (index - 1)) - this.week + 1000);
        var dst2 = new DetectDayLight(this.firstThursday - (this.week * (index - 1)) + 1000);
        //console.log("dst1 "+dst1.getTime());
        //console.log("dst2 "+dst2.getTime());


        //posun během zimního času letní termíny; později odladit
        //funguje v zimě?
        if (dst1 == 0) hour1 -= 3600000;
        if (dst2 == 0) hour2 -= 3600000;

        //posun během letního času na zimní termíny; později odladit
        //funguje v létě?
        hour1 = dst1.getTime();
        hour2 = dst2.getTime();

        var dtStart = new Date(this.firstThursday);
        var dtEnd = new Date(this.firstThursday);
        dtStart.setMilliseconds(this.firstThursday.getMilliseconds() + (1000));

        if (index === 0) {
            dtStart.toLocaleTimeString(this._getLang, format);
            dtEnd = new Date(this.currentTime);

        } else {
            dtEnd = new Date(this.firstThursday);
            dtStart.setDate(this.firstThursday.getDate() - (7 * index));
            dtEnd.setDate(this.firstThursday.getDate() - (7 * (index - 1)));
        }

        //x rozlišuje jestli se používá pro hlavičku tabulky nebo pro nadpis ve výpisu seznamu postů
        if (x === 0) {
            result = 'od ' + dtStart.toLocaleTimeString(this._getLang, format)
                + '<br>do ' + dtEnd.toLocaleTimeString(this._getLang, format);

        } else {
            result = dtStart.toLocaleTimeString(this._getLang, format) + ' - '
                + dtEnd.toLocaleTimeString(this.getLang, format);
        }


        return result;
    }

    showAutors(index) {
        var div = document.createElement('div');
        var propComparator = (propName) => (a, b) => a[propName] === b[propName] ? 0 : a[propName] > b[propName] ? 1 : -1;
        if (this.arrayAuthorsByTime.length > index) {
            this.arrayAuthorsByTime[index].sort(propComparator('author'));

            //console.log(a);
            for (const post of this.arrayAuthorsByTime[index]) {
                //console.log(a);
                //result = result + Date.parse(a.time + '+00:00') + ' ' + a.author + '<br>';
                //result = result + ' ' + a.author + '<br>';
                var div2 = document.createElement('div');
                div2.textContent = '@' + post.author;
                div2.onclick = () => { this.showPostAutor(post); };
                //console.log(post);
                div.appendChild(div2);
            }
        }


        return div;
    }

    showSummary(index) {
        var result;
        if (this.arrayAuthorsByTime.length > index) {
            result = 'Autorů: ' + this.arrayAuthorsByTime[index].length + '<br> Postů: ' + this.sortArrayPostsByTime[index].length;
            //console.log(this.sortArrayPostsByTime[index]);
        } else
            result = 'Autorů: ' + 0 + '<br> Postů: ' + 0;
        return result;
    }

    viewResult() {
        for (var a of this.arrayAuthors) {
            //console.log(a);
            //result = result + Date.parse(a.time + '+00:00') + ' ' + a.author + '<br>';
            //result = result + a.time + ' ' + a.author + '<br>';
        }
        this.sortPostsByTime();
        this.mergeAuthor();
        new Graph(this.canvas, this.arrayAuthorsByTime, this.sortArrayPostsByTime, this.countWeek, this.week, this.firstThursday);

        //this.tableAutors = document.createElement('table');
        //var row = document.createElement('tr');//řádek
        var cell = document.createElement('td');
        //console.log(this.countWeek);
        var countColumn = 10;//počet sloupců v tabulce
        var countCycles = this.countWeek / countColumn;//počet cyklů, počet opakování tabulky
        //console.log("countCycles: "+countCycles);
        for (var y = 0; y < countCycles; y++) {
            var indexStart = y * countColumn;
            var indexStop = y * countColumn + countColumn - 1;
            if (indexStop > this.countWeek) indexStop = this.countWeek - 1;
            var row = document.createElement('tr');//řádek
            //console.log("indexStart: "+indexStart+" indexStop: "+indexStop);
            //hlavička
            for (var i = indexStop; i >= indexStart; i--) {
                var cellHead = document.createElement('th');
                cellHead.innerHTML = this.showHeadTable(i, 0);

                row.appendChild(cellHead);
                //console.log(cellHead.parentElement);
                //row.insertBefore(cellHead,cellHead);

            }
            this.tableAutors.appendChild(row);
            row = document.createElement('tr');//řádek
            for (var i = indexStop; i >= indexStart; i--) {
                cell = document.createElement('td');
                cell.innerHTML = this.showSummary(i);
                const div = document.createElement('div');
                div.innerHTML = 'Zobraz vše';
                const index = i;
                div.onclick = () => this.showAllPost(index);
                cell.appendChild(div);
                row.appendChild(cell);
                this.tableAutors.appendChild(row);
            }
            row = document.createElement('tr');//řádek
            for (var i = indexStop; i >= indexStart; i--) {
                cell = document.createElement('td');
                //cell.innerHTML = this.showAutors(i);
                cell.appendChild(this.showAutors(i));
                row.appendChild(cell);
                this.tableAutors.appendChild(row);
            }

        }

        document.body.appendChild(this.tableAutors);
        //this.divTable.appendChild(this.tablePostsAuthor);
        //document.body.appendChild(this.divTable);
        this.progressBar.style.visibility = "hidden";
        this._disable(false);
    }

    showAllPost(index) {
        //console.log(index);
        //console.log(this.sortArrayPostsByTime[index]);
        while (this.tablePostsAuthor.lastChild) {
            this.tablePostsAuthor.removeChild(this.tablePostsAuthor.lastChild);
            //console.log(this.table.childNodes[i]);
            //console.log("i:");
        }
        this.selectAuthorH3.textContent = 'V období ' + this.showHeadTable(index, 1) + ' bylo napsáno';
        if (this.arrayAuthorsByTime.length > index) {
            for (var i = 0; i < this.sortArrayPostsByTime[index].length; i++) {
                const cellTime = document.createElement('td');
                const cellAuthor = document.createElement('td');
                const cellTitle = document.createElement('td');
                const row = document.createElement('tr');
                const author = this.sortArrayPostsByTime[index][i].author;
                cellAuthor.textContent = '@' + author;
                cellAuthor.onclick = () => this.wwwLink(author, null);
                cellTime.textContent = this.sortArrayPostsByTime[index][i].getTime();
                cellTitle.textContent = this.sortArrayPostsByTime[index][i].title;
                const pl = this.sortArrayPostsByTime[index][i].permlink;
                cellTitle.onclick = () => this.wwwLink(author, pl);
                row.appendChild(cellTime);
                row.appendChild(cellAuthor);
                row.appendChild(cellTitle);
                //console.log(author.arrayPermlink[i]);
                this.tablePostsAuthor.appendChild(row);
            }


        }
        this.divTable.appendChild(this.selectAuthorH3);
        this.divTable.appendChild(this.tablePostsAuthor);
        document.body.appendChild(this.divTable);

    }

    showPostAutor(author) {
        //var index = [].indexOf.call(child.parentNode.children, child);
        //console.log(event);
        //console.log(author);
        while (this.tablePostsAuthor.lastChild) {
            this.tablePostsAuthor.removeChild(this.tablePostsAuthor.lastChild);
            //console.log(this.table.childNodes[i]);
            //console.log("i:");
        }


        this.selectAuthorH3.textContent = 'Napsané posty od @' + author.author + ' ve vybraném týdnu';
        this.selectAuthorH3.id = 'date';
        for (var i = 0; i < author.arrayTime.length; i++) {
            const cellTime = document.createElement('td');
            const cellTitle = document.createElement('td');
            const row = document.createElement('tr');
            cellTime.textContent = author.getTime(i);
            cellTitle.textContent = author.arrayTitle[i];
            const pl = author.arrayPermlink[i];
            cellTitle.onclick = () => this.wwwLink(author.author, pl);
            row.appendChild(cellTime);
            row.appendChild(cellTitle);
            //console.log(author.arrayPermlink[i]);
            this.tablePostsAuthor.appendChild(row);
        }


        this.divTable.appendChild(this.selectAuthorH3);
        this.divTable.appendChild(this.tablePostsAuthor);
        document.body.appendChild(this.divTable);
    }

    wwwLink(author, permlink) {
        if (permlink === null)
            window.open(this.www + '@' + author, '_blank');
        else
            window.open(this.www + '@' + author + '/' + permlink, '_blank');
    }

    updateProgresBar(s) {
        //var width = this.bar.style;
        //console.log(this.bar.style);
        this.bar.innerHTML = s;
        this.progressWidth += 2;
        if (this.progressWidth > 100) this.progressWidth = 100;
        this.bar.style.width = this.progressWidth + '%';
    }

    _getLang() {
        if (navigator.languages !== undefined)
            return navigator.languages[0];
        else
            return navigator.language;
    }

    _disable(value) {
        this.selectNode.disabled = value;
        this.btnAddLoad.disabled = value;
        this.btnLoad.disabled = value;
        this.inputTag.disabled = value;
        this.inputCountWeek.disabled = value;
        this.inputAddWeek.disabled = value;
        if (value) {
            this.tableAutors.style.visibility = "hidden";
            this.canvas.style.visibility = "hidden";
            this.canvas.style.height = "0px";
        } else {
            this.tableAutors.style.visibility = "visible";
            this.canvas.style.visibility = "visible";
            this.canvas.style.height = "200px";
        }
    }
}



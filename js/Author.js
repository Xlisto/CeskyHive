/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

class Author {
    
    constructor(author, permlink, title, time) {
        this.arrayPermlink = new Array();
        this.arrayTitle = new Array();
        this.arrayTime = new Array();
        this.author = author;
        this.arrayPermlink.push(permlink);
        this.arrayTitle.push(title);
        this.arrayTime.push(time);
    }
    
    addPost(permlink, title, time) {
        this.arrayPermlink.push(permlink);
        this.arrayTitle.push(title);
        this.arrayTime.push(time);
    }
    
    getTime(index) {
        const date = new Date(this.arrayTime[index]+'+00:00').toLocaleTimeString(this._getLang,{
                        //weekday: "long",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
        });
        return date;
    }
    
    _getLang() {
        if (navigator.languages !== undefined) 
        return navigator.languages[0]; 
        else 
        return navigator.language;
    }
}


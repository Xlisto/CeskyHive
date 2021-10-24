/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

class Post {
    
    constructor(author, permlink, title, time) {
        this.author = author;
        this.permlink = permlink;
        this.title = title;
        this.time = time;
    }
    
    getTime() {
        const date = new Date(this.time+'+00:00').toLocaleTimeString(this._getLang,{
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


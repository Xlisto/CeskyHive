
/**
 * vykreslení grafu
 **/
class Graph {

    constructor(canvas, arrayAuthorsByTime, sortArrayPostsByTime, countWeek, week, firstThursday) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.arrayAuthorsByTime = arrayAuthorsByTime;
        this.sortArrayPostsByTime = sortArrayPostsByTime;
        this.countWeek = countWeek;
        this.week = week;
        this.firstThursday = firstThursday;
        this.showGraf();
    }

    showGraf() {
        if(this.countWeek>10) this.canvas.width = 1024;
        else this.canvas.width = 640;
        var maxAuthors = 0;
        var minAuthors = 0;
        var maxPosts = 0;
        var minPosts = 0;
        var notePx = 12;
        var height = this.canvas.height;//výška
        var width = this.canvas.width;
        var heightGraf = height - notePx - 0.5;
        var widthAuthor = width/(this.countWeek-1);
        this.context.clearRect(0,0,width, height);
        for(var i=0; i<this.countWeek; i++) {
            if(this.arrayAuthorsByTime.length>i) {
                var countAuthors = this.arrayAuthorsByTime[i].length;
                if(i===0) minAuthors = countAuthors;
                if(minAuthors>countAuthors) minAuthors = countAuthors;
                if(maxAuthors<countAuthors) maxAuthors = countAuthors; 
            }
            
        }
        //výpis svyslých vodících čar s poznámkou
        for(var i=0; i<this.countWeek; i++) {
            if(this.arrayAuthorsByTime.length>i) {
                var countPosts = this.sortArrayPostsByTime[i].length;
                if(i===0) minPosts = countPosts;
                if(minPosts>countPosts) minPosts = countPosts;
                if(maxPosts<countPosts) maxPosts = countPosts;
                this.context.beginPath();
                this.context.lineWidth = 1;
                this.context.moveTo(width-(i*widthAuthor)-0.5, 0);
                this.context.lineTo(width-(i*widthAuthor)-0.5, heightGraf);
                this.context.setLineDash([1,2]);
                this.context.strokeStyle = 'grey';
                this.context.stroke();
                this.context.closePath();
                this.context.save();
                this.context.translate(width-(i*widthAuthor), 10);
                this.context.rotate(-Math.PI/2);
                this.context.textAlign = "center";
                if(i!==0) {
                    var hour = new DetectDayLight(this.firstThursday-(this.week*i)+this.week).getTime();
                    this.context.fillText(new Date(this.firstThursday-(this.week*i)+this.week+hour).toLocaleTimeString(this._getLang,{
                            //weekday: "long",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                    }), -heightGraf/2, -5);
                }
                
                this.context.restore();
                this.context.setLineDash([0,0]);    
            }
        }
        
        
        var heightAuthor = heightGraf/(maxAuthors-minAuthors);
        var heightPost = heightGraf/(maxPosts-minPosts);
        
        
        //oddělovač poznámky
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'black';
        this.context.moveTo(0.5,heightGraf);
        this.context.lineTo(width,heightGraf);
        this.context.moveTo(10,10);
        this.context.stroke();
        this.context.closePath();
        
        
        //graf autorů
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#102bf6';
        this.context.moveTo(width,heightGraf-(this.arrayAuthorsByTime[0].length-minAuthors)*heightAuthor);
        for(var i=1; i<this.countWeek; i++) {
            if(this.arrayAuthorsByTime.length>=this.countWeek) {
                //console.log(heightGraf-(this.arrayAuthorsByTime[i].length-minAuthors)*heightAuthor);
                this.context.lineTo(width-(i*widthAuthor), heightGraf-(this.arrayAuthorsByTime[i].length-minAuthors)*heightAuthor);
            }
           
        }
        //legenda dole
        this.context.moveTo(30,height-5.5);
        this.context.lineTo(80,height-5.5);
        this.context.stroke();
        this.context.closePath();
        
        //graf postů
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'red';
        
        this.context.moveTo(width,heightGraf-(this.sortArrayPostsByTime[0].length-minPosts)*heightPost);
        for(var i=1; i<this.countWeek; i++) {
            if(this.arrayAuthorsByTime.length>=this.countWeek) {
                //console.log(heightGraf-(this.sortArrayPostsByTime[i].length-minPosts)*heightPost);
                this.context.lineTo(width-(i*widthAuthor), heightGraf-(this.sortArrayPostsByTime[i].length-minPosts)*heightPost);
            }
           
        }
        //legenda dole
        this.context.moveTo(130,height-5.5);
        this.context.lineTo(180,height-5.5);
        this.context.stroke();
        
        
        this.context.closePath();
        
        //výpis mezních hodnot
        this.context.beginPath();
        this.context.fillText(maxAuthors,0,8);
        this.context.fillText(minAuthors,0,heightGraf-2);
        this.context.fillText(maxPosts,width-15,8);
        this.context.fillText(minPosts,width-15,heightGraf-2);
        this.context.fillText('Autor', 0, height-2);
        this.context.fillText('Post', 100, height-2);
        this.context.closePath();
    }

    _getLang() {
        if (navigator.languages !== undefined) 
        return navigator.languages[0]; 
        else 
        return navigator.language;
    }
}

//detekce letního času
class DetectDayLight {

    constructor(time) {
        var timeOffset = new Date(time).getTimezoneOffset();
        var hour = 0;
        if (timeOffset === -60 ) {hour = 60 * 60 * 1000;}//tento v zimnim období připočítával hodinu
        //if (timeOffset === -60 ) {hour = 0;}
        if (timeOffset === -120) {hour = 0;}
        //v zimním období je timeOffset -60
        //console.log(hour);
        //console.log(new Date(time)+" "+timeOffset);
        this.hour = hour;
        return hour;
    }

    getTime() {
        return this.hour;
    }

}
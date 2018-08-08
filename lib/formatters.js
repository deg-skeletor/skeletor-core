const millisecondsInHour = 3600000;
const millisecondsInMinute = 60000;
const millisecondsInSecond = 1000;

function formatDuration(duration) {
    if(duration >= millisecondsInHour) {
        return `${duration/millisecondsInHour}h`;
    }
    
    if(duration >= millisecondsInMinute) {
        return `${duration/millisecondsInMinute}m`;
    }
    
    if(duration >= millisecondsInSecond) {
        return `${duration/millisecondsInSecond}s`;
    }

    return `${duration}ms`;
}

module.exports = {
    formatDuration
}
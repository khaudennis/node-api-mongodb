module.exports = {
    // fileNameFriendly - Used in file names such as logs, etc., strips out colons.
    // dateOnly -- Strips out time and displays only date.
    getDateTime: function (fileNameFriendly, dateOnly) {
        fileNameFriendly = fileNameFriendly || false;
        dateOnly = dateOnly || false;

        let date = new Date();

        let hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        let min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        let sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        let year = date.getFullYear();

        let month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        let day = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        if (fileNameFriendly) {
            if (dateOnly) {
                return year + "_" + month + "_" + day;
            } else {
                return year + "_" + month + "_" + day + "_" + hour + "_" + min + "_" + sec;
            }
        } else {
            if (dateOnly) {
                return year + "-" + month + "-" + day;
            } else {
                return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec;
            }
        }
    },

    removeParameter: function (url, parameter) {
        let urlParts = url.split('?');
        if (urlParts.length >= 2) {
            let prefix = encodeURIComponent(parameter) + '=';
            let parts = urlParts[1].split(/[&;]/g);

            for (let i = parts.length; i-- > 0;) {
                if (parts[i].lastIndexOf(prefix, 0) !== -1) {
                    parts.splice(i, 1);
                }
            }

            url = urlParts[0] + (parts.length > 0 ? '?' + parts.join('&') : "");

            return url;
        } else {
            return url;
        }
    }
};
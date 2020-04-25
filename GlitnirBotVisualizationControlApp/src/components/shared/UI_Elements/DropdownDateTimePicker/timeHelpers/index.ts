export const dateTimeFormat = (dateString: string, timeString: string) => {
    let newDateTime = new Date(dateString);

    if (timeString) {
        const split1 = timeString.split(":");
        const hours = parseInt(split1[0]);
        const split2 = split1[1].split(" ");
        const mins = parseInt(split2[0]);
        const amPm = split2[1];

        let addedHours =
        amPm === "am"
            ? hours === 12
            ? 0
            : hours
            : hours === 12
            ? hours
            : hours + 12;

        newDateTime.setSeconds(0);
        newDateTime.setHours(addedHours);
        newDateTime.setMinutes(mins);
    } else {
        newDateTime.setSeconds(0);
        newDateTime.setHours(0);
        newDateTime.setMinutes(0);
    }

    return newDateTime;
};
  
export function decomposeDateTime(dateTime: Date) {
    const dateString = dateTime.toDateString();
    const timeString = formatTimeToAMPM(dateTime);

    return {
        date: dateString,
        time: timeString
    };
}

export function formatTimeToAMPM(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutesStr + ' ' + ampm;
    return strTime;
}
  
  
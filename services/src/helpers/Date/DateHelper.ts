class DateHelper {

  parseBRL(date: string): Date | null {
    const substrings = date.split('/');
    if (substrings.length < 3) return null;
    return new Date(`${substrings[2]}-${substrings[1]}-${substrings[0]}`);
  }

  fromUTC(isoString: string | null): Date | null {
    if (!isoString) return null;
    const utc = Date.UTC(
      Number(isoString.substr(0, 4)),
      Number(isoString.substr(5, 2)) - 1,
      Number(isoString.substr(8, 2)),
      isoString.substr(11, 2) ? Number(isoString.substr(11, 2)) : 0,
      isoString.substr(14, 2) ? Number(isoString.substr(14, 2)) : 0,
      isoString.substr(17, 2) ? Number(isoString.substr(17, 2)) : 0,
      isoString.substr(17, 2) ? Number(isoString.substr(20, 3)) : 0,
    )
    return new Date(utc);
  }

  toUTCString(date: Date | null): string | null {
    if (!date) return null;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const second = String(date.getUTCSeconds()).padStart(2, '0');
    const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${ms}`
  }

}

export default new DateHelper();

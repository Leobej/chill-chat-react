export const timeStampConverter = (time: Date) => {
    const date = new Date(time);
    const minute = date.getMinutes();
    const hour = date.getHours();
    return `${hour}:${minute}`;
};

export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
        return '-';
    }

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const date = new Date(dateString);

    return new Intl.DateTimeFormat('ru-RU', options).format(date);
};

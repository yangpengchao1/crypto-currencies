export const checkStatus = (status: number) => {
    if (status.toString().startsWith("2") || status.toString().startsWith("3")) {
        return true;
    } else {
        return false;
    }
}
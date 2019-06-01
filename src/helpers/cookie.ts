const cookie = {
    read(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^|;\\s*)('+ name +')=([^;]*)'));
        // match[0]是全部，match[3]是第三个括号中的值，即是cookie的value
        return match ? match[3] : null
    }
}

export default cookie
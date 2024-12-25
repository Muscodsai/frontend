export function popup(html: Element | string): void {
    (async () => {
        setTimeout(() => {
            alert(html);
    }, 10);})();
}
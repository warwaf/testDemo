
function getContext() {
    const pages = getCurrentPages();
    return pages[pages.length - 1].selectComponent("#vPage");
}

function Popup(options){
    const context = options.context || getContext();
    options.selector = options.selector || "#vPopup"

    const popup = context.selectComponent(options.selector);
    if (!popup) {
        console.warn('未找到 v-popup 节点，请确认 selector 及 context 是否正确');
        return;
    }
    popup.setData({
        show: true,
        maskCancel: false
    })
    return popup;
}

export default Popup;
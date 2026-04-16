// 解决H5软键盘弹出时遮挡输入框
class inputTop {
    page = document.querySelector('#app');

    currentInput: any; // 当前聚焦的输入框

    lastInnerHeight = window.innerHeight;

    calcScrollTop = (visualHeight: number | undefined, scrollObj: Element | Window) => {
        scrollObj = scrollObj || window;
        const currentInputTop = this.currentInput.getBoundingClientRect().top;
        // 已经偏移（滚动）的量
        let yOffset = window.pageYOffset;
        if (scrollObj !== window && scrollObj instanceof Element) {
            yOffset = scrollObj.scrollTop;
        }
        if (!visualHeight) return;
        // 不在可视视口中
        // 被软键盘遮住
        if (currentInputTop > visualHeight) {
            scrollObj.scrollTo(0, yOffset + currentInputTop - visualHeight / 2 + this.currentInput.offsetHeight / 2);
            // 滚上去了可视视口，被视口遮住
        } else if (currentInputTop < 0) {
            scrollObj.scrollTo(0, yOffset - currentInputTop - visualHeight / 2 + this.currentInput.offsetHeight / 2);
        }
    };

    handleClickPage = (e: Event) => {
        const el = e.target as HTMLElement | null;
        if (el && /^input$/i.test(el.tagName)) {
            this.currentInput = el;
        }
    };

    handleAndroidResize = () => {
        const resizeHeight = this.lastInnerHeight - window.innerHeight; // 本次变动量
        this.lastInnerHeight = window.innerHeight; // 记录目前的可视窗口高度，以便下次计算resize变动量
        // 弹出软键盘
        if (resizeHeight > 200 && this.currentInput) {
            setTimeout(() => {
                // 第二个参数，如果当前布局结构是页面容器设置了高度和可视视口高度一样，滚动条是属于这个H5容器的而不是window，如例子中的div.page，
                // 则第二个参数要传滚动容器的dom对象，如 document.querySelector('.page')
                this.calcScrollTop(window.innerHeight, window);
            }, 150);
        }
    };

    focusinPage = (e: FocusEvent) => {
        this.currentInput = (e || window.event).target;
        setTimeout(() => {
            // 第二个参数采用默认的window，在ios中不论页面布局怎样，只要软键盘出现前已经出现过可视视口的，那么软键盘出现后必然能通过webview平移看得到
            this.calcScrollTop(window.visualViewport?.height, window);
        }, 300);
    };

    init = () => {
        if (/iphone|ipad|ipod|ios/i.test(navigator.userAgent)) {
            window.addEventListener('focusin', this.focusinPage);
        } else {
            window.addEventListener('click', this.handleClickPage, true);
            window.addEventListener('resize', this.handleAndroidResize);
        }
    };
}

export default new inputTop();

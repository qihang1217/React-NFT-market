// 函数防抖
export function debounce(callback, delay = 200) {
    // console.log('args',arguments)
    return function () {
        // console.log('debounce')
        //保存this和arguments
        const that = this;
        const args = arguments;

        //清除待执行的定时器任务
        if (callback.timeoutId) {
            clearTimeout(callback.timeoutId);
        }
        //    每隔delay的时间,启动一个新的延迟定时器,准备去调用callback
        callback.timeoutId = setTimeout(function () {
            callback.apply(that, args)
            //    如果定时器回调了,删除标记
            delete callback.timeoutId
        }, delay)
    }
}
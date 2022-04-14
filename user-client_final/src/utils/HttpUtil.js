export default class HttpUtil {
    //自定义定义的get函数，只需要指定访问api即可
    static get(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.status + " : " + response.statusText);
                }
            })
            .then(result => resolve(result))
            .catch(error => {
                reject(error);
            })
        });
    }
    
    //自定义的post函数，不仅指定api，还有参数
    static post(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
                .then(result => resolve(result))
                .catch(error => {
                    reject(error);
                })
        })
    }

}

class LocalStorage {
    static DATAKEY = 'webwork_data';

    static getData(callback) {
        chrome.storage.sync.get([this.DATAKEY], (data) => {
            if (!this.hasData(data)) {
                return this.initializeData(callback);
            }
            callback(data);
        });
        
    } 

    static setData(data, callback) {
        chrome.storage.sync.set(data, callback);
    } 

    static initializeData(callback) {
        this.setData({webwork_data:
            {
                classes : [],
                webwork_home_link : [],
                webwork_home_link_set : false
            }
        }, callback);
    }
    
    static hasData(data) {
        return !!Object.keys(data).length;
    }
}
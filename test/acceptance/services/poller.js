class poller {
    static pollingIntervalSeconds = 1;
    
    static async pollForSuccess(predicate, pollingLimit = 30) {
        for (let i = 0; i < pollingLimit; i++) {
            if (await predicate()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, this.pollingIntervalSeconds * 1000));
        }
        
        return false;
    }
  }

  
module.exports = poller;
  
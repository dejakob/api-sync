# API Sync

## Install
```
npm i --save dejakob/api-sync-js
```

## About
Queue API calls and merge data of calls with the same end point.

## Config
### Change timeout between calls
```
// Also reachable with window.ApiSync
import ApiSync from 'api-sync';

ApiSync.timeout = 2000;
```

## Usage
### Add
Add a call to the queue
```
import ApiSync from 'api-sync';

const type = 'POST';
const url = '/todo';
const data = { content: 'Just a todo' };

// Optional
const options = {
    onComplete: () => {}
};

ApiSync.add(type, url, data, options);
```

### Remove
Remove all calls from a certain end point
```
import ApiSync from 'api-sync';

const type = 'POST';
const url = '/todo';

ApiSync.remove(type, url);
```
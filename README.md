# API Sync
<a href="https://codeclimate.com/github/dejakob/api-sync"><img src="https://codeclimate.com/github/dejakob/api-sync/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/dejakob/api-sync/coverage"><img src="https://codeclimate.com/github/dejakob/api-sync/badges/coverage.svg" /></a>
<a href="https://codeclimate.com/github/dejakob/api-sync"><img src="https://codeclimate.com/github/dejakob/api-sync/badges/issue_count.svg" /></a>

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

## Example
```
import ApiSync from 'api-sync';

ApiSync.timeout = 3000;

ApiSync.add('POST', '/todo', { title: 'new todo' });
ApiSync.add('POST', '/todo', { content: 'Do the laundry' });
ApiSync.add('POST', '/todo', { title: 'new todo!' });
ApiSync.add('POST', '/user', { name: 'dejakob' });
```
Api calls will be like:

| TIME | METHOD | URL   | DATA  |
| ---- | ------ | ----- | ----: |
| 0s   |        |       |       |
| 3s   | POST   | /todo | content=Do%20%the%20laundry&title=new%20todo! |
| 6s   | POST   | /user | name=dejakob |

[![gitcheese.com](https://s3.amazonaws.com/gitcheese-ui-master/images/badge.svg)](https://www.gitcheese.com/donate/users/5782495/repos/55349715)

const fs = require('fs');
const path = require('path');
const lo = require('lodash');
const dataDir = require('../data/index');

class Parser {
	constructor() {
		this.filePath = path.join(dataDir.getDirectory(), 'agent-log.txt');
	}


	recur(logObject = undefined, parent = undefined) {
		if (!logObject) {
			return [];
		}
		let retval = [];
		if (logObject instanceof Array) {
			for (let curItem of logObject) {
				let states = this.recur(curItem, parent);
				if (states) {
					retval.push(...states);
				}
			}
		} else if (logObject instanceof Object) {
			for (let key of Object.keys(logObject)) {
				let value = logObject[key];
				if (key === 'state') {
					retval.push({...value, ...{parent: parent}})
				} else {
					let state = this.recur(value, key);
					retval.push(...state);
				}
			}
		}
		return retval;

	}

	postProcess(states = []) {
		let retval = [...states];
		for (let i = 0; i < retval.length; i += 1) {
			let curState = retval[i];
			if (!curState.name) {
				curState.name = curState.type;
			}
			curState.parent = curState.parent.replace('snapshot', 'agent');
		}
		for (let i = 0; i < retval.length; i += 1) {
			let curState = retval[i];
			for (let key of Object.keys(curState)) {
				curState[key] = lo.capitalize(curState[key])
			}
		}
		return retval;
	}

	async parseStates() {
		const payload = fs.readFileSync(this.filePath);
		const jsonContent = JSON.parse(payload);
		let states = [];
		for (let item of jsonContent) {
			let retval = this.recur(item);
			if (retval instanceof Array && retval.length > 0) {
				let data = this.postProcess(retval);
				states.push(data);
			}
		}
		return states;
	}
}

module.exports = Parser;

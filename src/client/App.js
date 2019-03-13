import React, {Component} from 'react';
import moment from 'moment';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	sleep() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 1 * 1000);
		});
	}


	componentDidMount() {
		fetch('/api/data')
			.then(res => res.json())
			.then(data => {
				(async () => {
					for (let states of data) {
						let first = true;
						for (let curState of states) {
							await this.sleep();
							console.log(first ? '$' : '\t\t$', curState.startTimestamp && moment(new Date(curState.startTimestamp)).calendar(), curState.parent, curState.name);
							first = false;

						}
						console.log('---------------');
					}
				})();
			});
	}

	render() {
		return (
			<div>
				<h3> Get Logs </h3>
			</div>
		);
	}
}
